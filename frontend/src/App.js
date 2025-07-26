import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import DesignConstruction from './pages/DesignConstruction';
import RepairMaintenance from './pages/RepairMaintenance';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TestCalendar from './pages/TestCalendar';

// Testing Components
import IntegrationTest from './components/Testing/IntegrationTest';

// Context
import { AppProvider } from './context/AppContext';

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
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/design-construction" element={<DesignConstruction />} />
              <Route path="/repair-maintenance" element={<RepairMaintenance />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/test-calendar" element={<TestCalendar />} />
              <Route path="/integration-test" element={<IntegrationTest />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
