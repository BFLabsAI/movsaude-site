import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { QuemSomos } from '@/pages/QuemSomos'
import { Projetos } from '@/pages/Projetos'
import { Projeto } from '@/pages/Projeto'
import { Contato } from '@/pages/Contato'
import { TrabalheConosco } from '@/pages/TrabalheConosco'
import { AdminAuthProvider } from '@/contexts/AdminAuth'
import { RequireAuth } from '@/components/admin/RequireAuth'
import { AdminShell } from '@/components/admin/AdminShell'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminContatos } from '@/pages/admin/AdminContatos'
import { AdminCandidatos } from '@/pages/admin/AdminCandidatos'

function AdminRoot() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  )
}

function AdminProtected() {
  return (
    <RequireAuth>
      <AdminShell />
    </RequireAuth>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site público */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quem-somos" element={<QuemSomos />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="projetos/:slug" element={<Projeto />} />
          <Route path="trabalhe-conosco" element={<TrabalheConosco />} />
          <Route path="contato" element={<Contato />} />
        </Route>

        {/* Painel oculto — sem link no menu do site */}
        <Route path="painel" element={<AdminRoot />}>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<AdminProtected />}>
            <Route index element={<AdminDashboard />} />
            <Route path="contatos" element={<AdminContatos />} />
            <Route path="candidatos" element={<AdminCandidatos />} />
          </Route>
          <Route path="*" element={<Navigate to="/painel" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
