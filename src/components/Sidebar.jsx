import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const { currentUser, isAuthenticated, unreadMessageCount, logout } = useApp();

  const navItems = [
    { to: '/search', icon: 'fa-magnifying-glass', label: 'Search Listings' },
    { to: '/listings/create', icon: 'fa-plus-circle', label: 'Create Listing' },
    { to: '/my-listings', icon: 'fa-building', label: 'My Listings' },
    { to: '/applications', icon: 'fa-file-lines', label: 'Applications' },
    { to: '/favorites', icon: 'fa-heart', label: 'Favorites' },
    { to: '/messages', icon: 'fa-envelope', label: 'Messages', badge: unreadMessageCount },
    { to: '/profile', icon: 'fa-user', label: 'Profile' },
  ];

  const adminItems = [
    { to: '/admin', icon: 'fa-shield-halved', label: 'Admin Dashboard' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={onClose}
        />
      )}

      <nav className={`sidebar d-flex flex-column ${isOpen ? 'show' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Brand — links to dashboard (home), with collapse toggle */}
        <div className="sidebar-brand">
          <NavLink to="/dashboard" className="text-decoration-none" onClick={onClose}>
            <div className="d-flex align-items-center gap-2">
              <div className="brand-icon">
                <i className="fa-solid fa-house-chimney brand-icon-default"></i>
                <span className="brand-icon-hover">
                  <i className="fa-solid fa-house"></i>
                </span>
              </div>
              <div className="brand-text">
                <h5 className="mb-0 fw-bold text-white">Perch</h5>
                <small className="text-white-50">BC Housing</small>
              </div>
            </div>
          </NavLink>
          <button
            className="sidebar-collapse-btn d-none d-lg-flex"
            onClick={onToggleCollapse}
            type="button"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fa-solid fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
          </button>
        </div>

        {/* Nav Links */}
        {isAuthenticated && (
          <div className="sidebar-nav flex-grow-1">
            <div className="px-3 py-2 section-label">
              <small className="text-uppercase text-white-50 fw-semibold letter-spacing">Menu</small>
            </div>
            <ul className="nav flex-column">
              {navItems.map(item => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <i className={`fa-solid ${item.icon} sidebar-icon`}></i>
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="badge bg-danger ms-auto rounded-pill">{item.badge}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {currentUser?.role === 'admin' && (
              <>
                <div className="px-3 py-2 mt-3 section-label">
                  <small className="text-uppercase text-white-50 fw-semibold letter-spacing">Admin</small>
                </div>
                <ul className="nav flex-column">
                  {adminItems.map(item => (
                    <li className="nav-item" key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <i className={`fa-solid ${item.icon} sidebar-icon`}></i>
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* User section at bottom */}
        {isAuthenticated && currentUser && (
          <div className="sidebar-user">
            <div className="d-flex align-items-center gap-2">
              <img
                src={currentUser.profileImage}
                alt={currentUser.firstName}
                className="rounded-circle"
                width="36"
                height="36"
                style={{ flexShrink: 0 }}
              />
              <div className="flex-grow-1 min-w-0 user-info">
                <div className="text-white fw-semibold text-truncate small">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-white-50 text-truncate" style={{ fontSize: '0.7rem' }}>
                  {currentUser.email}
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-light border-0 user-info"
                onClick={logout}
                title="Sign out"
                type="button"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
