
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatbotLauncher from './components/ChatbotLauncher'
import Home from './pages/Home'
import MyApplications from './pages/MyApplications'
import ApplicationDetails from './pages/ApplicationDetails'
import HowItWorks from './pages/HowItWorks'
import UploadDocument from './pages/UploadDocument'
import Services from './pages/Services'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#F7F9FB' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/application/:id" element={<ApplicationDetails />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/upload" element={<UploadDocument />} />
        </Routes>
      </Box>
      <Footer />
      <ChatbotLauncher />
    </Box>
  )
}

export default App
