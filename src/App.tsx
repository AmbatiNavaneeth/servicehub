import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LocationProvider } from './context/LocationContext';
import { WishlistProvider } from './context/WishlistContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ServiceListingPage from './pages/ServiceListingPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingPage from './pages/BookingPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <WishlistProvider>
            <BookingProvider>
              <ToastProvider>
                <div className="min-h-screen flex flex-col">
                  <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/services" element={<ServiceListingPage />} />
                      <Route path="/service/:slug" element={<ServiceDetailPage />} />
                      <Route path="/book/:slug" element={<BookingPage />} />
                      <Route path="/bookings" element={<BookingHistoryPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ToastProvider>
            </BookingProvider>
          </WishlistProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
