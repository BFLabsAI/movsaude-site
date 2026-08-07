import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Notifica o grupo WhatsApp "MOV Saúde - NOTIFICAÇÕES" quando há:
 * - INSERT em contatos
 * - INSERT em candidaturas
 */

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UAZAPI_BASE =
  Deno.env.get("UAZAPI_BASE_URL") ?? "https://bflabs.uazapi.com";
const UAZAPI_TOKEN =
  Deno.env.get("UAZAPI_TOKEN") ??
  "c6f8f496-58f3-44e5-b697-f7ade84b9d1c";
const GROUP_JID =
  Deno.env.get("UAZAPI_GROUP_JID") ?? "120363427305648813@g.us";
// Domínio oficial do site (não usar *.vercel.app)
const PANEL_BASE =
  Deno.env.get("PANEL_PUBLIC_URL") ?? "https://www.movsaude.com";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function digitsPhone(raw: string | null | undefined): string {
  const d = String(raw ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("55")) return d;
  if (d.length >= 10 && d.length <= 11) return `55${d}`;
  return d;
}

function waLink(raw: string | null | undefined): string {
  const d = digitsPhone(raw);
  return d ? `https://wa.me/${d}` : "";
}

function esc(s: unknown): string {
  return String(s ?? "—").trim() || "—";
}

function formatContato(record: Record<string, unknown>): string {
  const id = esc(record.id);
  const nome = esc(record.nome);
  const cargo = esc(record.cargo);
  const municipio = esc(record.municipio);
  const uf = esc(record.uf);
  const email = esc(record.email);
  const telefone = esc(record.telefone);
  const projetos = Array.isArray(record.projetos)
    ? (record.projetos as string[]).join(", ") || "—"
    : esc(record.projetos);
  const mensagem = esc(record.mensagem);
  const wa = waLink(String(record.telefone ?? ""));
  const panel = `${PANEL_BASE}/painel/contatos?id=${encodeURIComponent(id)}`;

  const lines = [
    "🏥 *Novo interessado em projeto — MovSaúde*",
    "",
    `👤 *Nome:* ${nome}`,
    cargo !== "—" ? `💼 *Cargo:* ${cargo}` : null,
    `📍 *Município:* ${municipio}/${uf}`,
    `📧 *E-mail:* ${email}`,
    wa
      ? `📱 *WhatsApp:* ${telefone}\n   👉 ${wa}`
      : `📱 *Telefone:* ${telefone}`,
    `🧩 *Projetos:* ${projetos}`,
    mensagem !== "—" ? `💬 *Mensagem:*\n${mensagem}` : null,
    "",
    "📋 *Abrir no painel:*",
    panel,
  ].filter(Boolean);

  return lines.join("\n");
}

function formatCandidatura(record: Record<string, unknown>): string {
  const id = esc(record.id);
  const nome = esc(record.nome);
  const email = esc(record.email);
  const telefone = esc(record.telefone);
  const cidade = esc(record.cidade);
  const vaga = esc(record.vaga);
  const vagaOutra = esc(record.vaga_outra);
  const curriculo = esc(record.curriculo_nome);
  const mensagem = esc(record.mensagem);
  const wa = waLink(String(record.telefone ?? ""));
  const panel = `${PANEL_BASE}/painel/candidatos?id=${encodeURIComponent(id)}`;
  const vagaLabel =
    vagaOutra !== "—" ? `${vaga} (${vagaOutra})` : vaga;

  const lines = [
    "💼 *Novo candidato cadastrado — MovSaúde*",
    "",
    `👤 *Nome:* ${nome}`,
    `🎯 *Vaga de interesse:* ${vagaLabel}`,
    `📍 *Cidade:* ${cidade}`,
    `📧 *E-mail:* ${email}`,
    wa
      ? `📱 *WhatsApp:* ${telefone}\n   👉 ${wa}`
      : `📱 *Telefone:* ${telefone}`,
    curriculo !== "—" ? `📄 *Currículo:* ${curriculo}` : null,
    mensagem !== "—" ? `💬 *Mensagem:*\n${mensagem}` : null,
    "",
    "📋 *Abrir no painel:*",
    panel,
  ].filter(Boolean);

  return lines.join("\n");
}

async function sendWhatsApp(text: string) {
  const res = await fetch(`${UAZAPI_BASE}/send/text`, {
    method: "POST",
    headers: {
      token: UAZAPI_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number: GROUP_JID,
      text,
      linkPreview: true,
      async: false,
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Uazapi ${res.status}: ${body.slice(0, 400)}`);
  }
  try {
    return JSON.parse(body);
  } catch {
    return { raw: body };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const payload = await req.json().catch(() => ({}));

    const table =
      payload.table ||
      (payload.kind === "candidatura"
        ? "candidaturas"
        : payload.kind === "contato"
        ? "contatos"
        : null);
    const record =
      payload.record || payload.new || payload.row || null;

    if (!table || !record || typeof record !== "object") {
      return json(
        { error: "Payload inválido. Envie { table, record }" },
        400,
      );
    }

    const eventType = String(payload.type || payload.event || "INSERT").toUpperCase();
    if (eventType && !eventType.includes("INSERT") && payload.type !== undefined) {
      if (["UPDATE", "DELETE"].includes(eventType)) {
        return json({ ok: true, skipped: true, reason: eventType });
      }
    }

    let text: string;
    if (table === "contatos") {
      text = formatContato(record as Record<string, unknown>);
    } else if (table === "candidaturas") {
      text = formatCandidatura(record as Record<string, unknown>);
    } else {
      return json({ error: `Tabela não suportada: ${table}` }, 400);
    }

    const result = await sendWhatsApp(text);
    return json({
      ok: true,
      group: GROUP_JID,
      table,
      panelBase: PANEL_BASE,
      recordId: (record as { id?: string }).id ?? null,
      result,
    });
  } catch (e) {
    console.error(e);
    return json(
      { error: e instanceof Error ? e.message : "Erro interno" },
      500,
    );
  }
});
