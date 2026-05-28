import { HashRouter, Routes, Route } from 'react-router-dom'
import ShopPage from '@/pages/ShopPage'
import AdminPage from '@/pages/AdminPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  )
}
