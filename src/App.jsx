import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './context/AuthContext.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SmartRecommendations from './pages/SmartRecommendations.jsx'
import WeatherInsights from './pages/WeatherInsights.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/smart-recommendations" element={<SmartRecommendations />} />
          <Route path="/weather-insights" element={<WeatherInsights />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

