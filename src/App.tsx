import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { QuemSomos } from '@/pages/QuemSomos'
import { Projetos } from '@/pages/Projetos'
import { Projeto } from '@/pages/Projeto'
import { Contato } from '@/pages/Contato'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quem-somos" element={<QuemSomos />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="projetos/:slug" element={<Projeto />} />
          <Route path="contato" element={<Contato />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
