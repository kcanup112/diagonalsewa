import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import TawkToChat from './components/Chat/TawkToChat';
import ChatTooltip from './components/Chat/ChatTooltip';
// import OfferPopup from './components/OfferPopup'; // Disabled temporarily

// Pages
import Home from './pages/Home';
import DesignConstruction from './pages/DesignConstruction';
import RepairMaintenance from './pages/RepairMaintenance';
import Gallery from './pages/Gallery';
import Portfolio from './pages/Portfolio';
import AboutTeamPage from './pages/AboutTeamPage';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TestCalendar from './pages/TestCalendar';

// Testing Components
// import IntegrationTest from './components/Testing/IntegrationTest'; // Temporarily commented

// Context
import { AppProvider } from './context/AppContext';

// Component to handle scroll to top on route changes
const ScrollToTop = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          
          <Navbar />
          
          {/* Scroll to top on route change */}
          <ScrollToTop />
          
          {/* Tawk.to Live Chat */}
          <TawkToChat />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/design-construction" element={<DesignConstruction />} />
              <Route path="/repair-maintenance" element={<RepairMaintenance />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about-team" element={<AboutTeamPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/test-calendar" element={<TestCalendar />} />
              {/* <Route path="/integration-test" element={<IntegrationTest />} /> */}
            </Routes>
          </main>
          
          {/* Chat Tooltip */}
          <ChatTooltip />
          
          {/* Offer Popup - Disabled temporarily */}
          {/* <OfferPopup /> */}
          
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
