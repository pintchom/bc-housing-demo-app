import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import ApplyPage from './pages/ApplyPage';
import ProfilePage from './pages/ProfilePage';
import MyListings from './pages/MyListings';
import ApplicationsPage from './pages/ApplicationsPage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public pages (no sidebar) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* App pages (with sidebar layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/apply" element={<ApplyPage />} />
          <Route path="/listings/create" element={<CreateListing />} />
          <Route path="/listings/edit/:id" element={<CreateListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}
