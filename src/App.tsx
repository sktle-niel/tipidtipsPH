import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import TipsPage from './pages/TipsPage'
import TipDetailPage from './pages/TipDetailPage'
import PredictionsPage from './pages/PredictionsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import SavedTipsPage from './pages/SavedTipsPage'
import UnsubscribePage from './pages/UnsubscribePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/tips/:id" element={<TipDetailPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/saved" element={<SavedTipsPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
