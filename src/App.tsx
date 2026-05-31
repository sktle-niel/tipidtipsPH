import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProfileProvider } from './context/UserProfileContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LocationSetupBanner from './components/LocationSetupBanner'
import HomePage from './pages/HomePage'
import TipsPage from './pages/TipsPage'
import TipDetailPage from './pages/TipDetailPage'
import PredictionsPage from './pages/PredictionsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import SavedTipsPage from './pages/SavedTipsPage'
import UnsubscribePage from './pages/UnsubscribePage'
import LocationSetupPage from './pages/LocationSetupPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
          <Navbar />
          <LocationSetupBanner />
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
              <Route path="/setup-location" element={<LocationSetupPage />} />
            </Routes>
          </main>
          <Footer />
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
