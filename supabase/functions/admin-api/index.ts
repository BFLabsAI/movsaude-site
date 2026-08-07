import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function adminClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function bearer(req: Request): string | null {
  const h = req.headers.get("Authorization") ?? "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() || null;
}

async function requireSession(req: Request) {
  const token = bearer(req);
  if (!token) return { error: json({ error: "Não autenticado" }, 401) as Response };

  const sb = adminClient();
  const { data: session, error } = await sb
    .from("admin_sessions")
    .select("id, user_id, expires_at, admin_users(username)")
    .eq("token", token)
    .maybeSingle();

  if (error || !session) {
    return { error: json({ error: "Sessão inválida" }, 401) as Response };
  }
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await sb.from("admin_sessions").delete().eq("id", session.id);
    return { error: json({ error: "Sessão expirada" }, 401) as Response };
  }

  const joined = session.admin_users as
    | { username?: string }
    | { username?: string }[]
    | null;
  const username = Array.isArray(joined)
    ? joined[0]?.username ?? "admin"
    : joined?.username ?? "admin";

  return { sb, token, username };
}

function routePath(url: URL): string {
  let p = url.pathname;
  p = p.replace(/^\/functions\/v1\/admin-api/, "");
  p = p.replace(/^\/admin-api/, "");
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

const CONTATO_STATUSES = [
  "novo_contato",
  "em_contato",
  "em_negociacao",
  "ganho",
  "perdido",
] as const;

const CANDIDATO_STATUSES = [
  "novo_candidato",
  "triagem",
  "entrevista_agendada",
  "contratado",
  "sem_perfil",
] as const;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = routePath(url);
    const method = req.method.toUpperCase();

    if (method === "POST" && path === "/login") {
      const body = await req.json().catch(() => ({}));
      const username = String(body.username ?? "").trim();
      const password = String(body.password ?? "");

      if (!username || !password) {
        return json({ error: "Usuário e senha obrigatórios" }, 400);
      }

      const sb = adminClient();
      const { data: rows, error } = await sb.rpc("admin_login_match", {
        p_username: username,
        p_password: password,
      });

      if (error) {
        console.error("admin_login_match", error);
        return json({ error: "Falha na autenticação" }, 500);
      }

      const user = Array.isArray(rows) ? rows[0] : rows;
      if (!user?.id) {
        return json({ error: "Usuário ou senha inválidos" }, 401);
      }

      const token =
        crypto.randomUUID().replace(/-/g, "") +
        crypto.randomUUID().replace(/-/g, "");
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { error: sessErr } = await sb.from("admin_sessions").insert({
        user_id: user.id,
        token,
        expires_at: expiresAt,
      });

      if (sessErr) {
        console.error(sessErr);
        return json({ error: "Falha ao criar sessão" }, 500);
      }

      return json({
        token,
        expiresAt,
        username: user.username,
      });
    }

    const auth = await requireSession(req);
    if ("error" in auth && auth.error) return auth.error;
    const { sb, token, username } = auth as {
      sb: SupabaseClient;
      token: string;
      username: string;
    };

    if (method === "POST" && path === "/logout") {
      await sb.from("admin_sessions").delete().eq("token", token);
      return json({ ok: true });
    }

    if (method === "GET" && path === "/me") {
      return json({ username });
    }

    if (method === "GET" && path === "/stats") {
      const counts = async (table: string, status?: string) => {
        let q = sb.from(table).select("id", { count: "exact", head: true });
        if (status) q = q.eq("status", status);
        const { count } = await q;
        return count ?? 0;
      };

      const [
        cTotal, cNovo, cEm, cNeg, cGanho, cPerdido,
        aTotal, aNovo, aTri, aEnt, aCont, aSem,
      ] = await Promise.all([
        counts("contatos"),
        counts("contatos", "novo_contato"),
        counts("contatos", "em_contato"),
        counts("contatos", "em_negociacao"),
        counts("contatos", "ganho"),
        counts("contatos", "perdido"),
        counts("candidaturas"),
        counts("candidaturas", "novo_candidato"),
        counts("candidaturas", "triagem"),
        counts("candidaturas", "entrevista_agendada"),
        counts("candidaturas", "contratado"),
        counts("candidaturas", "sem_perfil"),
      ]);

      return json({
        contatos: {
          total: cTotal,
          novo_contato: cNovo,
          em_contato: cEm,
          em_negociacao: cNeg,
          em_andamento: cNovo + cEm + cNeg,
          ganho: cGanho,
          perdido: cPerdido,
        },
        candidaturas: {
          total: aTotal,
          novo_candidato: aNovo,
          triagem: aTri,
          entrevista_agendada: aEnt,
          em_processo: aNovo + aTri + aEnt,
          contratado: aCont,
          sem_perfil: aSem,
        },
      });
    }

    if (method === "GET" && path === "/contatos") {
      const status = url.searchParams.get("status");
      let q = sb.from("contatos").select("*").order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      const { data, error } = await q;
      if (error) return json({ error: error.message }, 500);
      return json({ items: data ?? [] });
    }

    if (method === "PATCH" && path === "/contatos/status") {
      const body = await req.json().catch(() => ({}));
      const id = String(body.id ?? "");
      const status = String(body.status ?? "");
      if (!id || !(CONTATO_STATUSES as readonly string[]).includes(status)) {
        return json({ error: "id/status inválidos" }, 400);
      }
      const { data, error } = await sb
        .from("contatos")
        .update({ status })
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      if (!data) return json({ error: "Contato não encontrado" }, 404);
      return json({ item: data });
    }

    if (method === "DELETE" && path === "/contatos") {
      const body = await req.json().catch(() => ({}));
      const id = String(body.id ?? url.searchParams.get("id") ?? "");
      if (!id) return json({ error: "id obrigatório" }, 400);
      const { error } = await sb.from("contatos").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, id });
    }

    if (method === "GET" && path === "/candidaturas") {
      const status = url.searchParams.get("status");
      let q = sb.from("candidaturas").select("*").order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      const { data, error } = await q;
      if (error) return json({ error: error.message }, 500);
      return json({ items: data ?? [] });
    }

    if (method === "PATCH" && path === "/candidaturas/status") {
      const body = await req.json().catch(() => ({}));
      const id = String(body.id ?? "");
      const status = String(body.status ?? "");
      if (!id || !(CANDIDATO_STATUSES as readonly string[]).includes(status)) {
        return json({ error: "id/status inválidos" }, 400);
      }
      const { data, error } = await sb
        .from("candidaturas")
        .update({ status })
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      if (!data) return json({ error: "Candidatura não encontrada" }, 404);
      return json({ item: data });
    }

    if (method === "DELETE" && path === "/candidaturas") {
      const body = await req.json().catch(() => ({}));
      const id = String(body.id ?? url.searchParams.get("id") ?? "");
      if (!id) return json({ error: "id obrigatório" }, 400);
      // tenta limpar CV do storage se houver
      const { data: row } = await sb
        .from("candidaturas")
        .select("curriculo_path")
        .eq("id", id)
        .maybeSingle();
      if (row?.curriculo_path) {
        await sb.storage.from("curriculos").remove([row.curriculo_path]).catch(() => {});
      }
      const { error } = await sb.from("candidaturas").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, id });
    }

    if (method === "GET" && path === "/cv-url") {
      const pathParam = url.searchParams.get("path") ?? "";
      if (!pathParam || pathParam.includes("..")) {
        return json({ error: "path inválido" }, 400);
      }
      const { data, error } = await sb.storage
        .from("curriculos")
        .createSignedUrl(pathParam, 120);
      if (error || !data?.signedUrl) {
        return json({ error: error?.message ?? "Falha ao gerar URL" }, 500);
      }
      return json({ url: data.signedUrl });
    }

    return json({ error: `Rota não encontrada: ${method} ${path}` }, 404);
  } catch (e) {
    console.error(e);
    return json(
      { error: e instanceof Error ? e.message : "Erro interno" },
      500,
    );
  }
});
