import { useState } from 'react'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import PredictPage from './pages/PredictPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('predict')

  return (
    <div className="app-shell">
      <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
      <main className="app-main">
        {activeTab === 'predict' ? <PredictPage /> : <DashboardPage />}
      </main>
      <Footer />
    </div>
  )
}
