import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/search': 'Search Listings',
  '/listings/create': 'Create Listing',
  '/my-listings': 'My Listings',
  '/applications': 'Applications',
  '/favorites': 'Favorites',
  '/messages': 'Messages',
  '/profile': 'My Profile',
  '/admin': 'Admin Dashboard',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Perch';

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={title}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
