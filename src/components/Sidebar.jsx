import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, isAuthenticated, unreadMessageCount, logout } = useApp();

  const navItems = [
    { to: '/dashboard', icon: 'fa-house', label: 'Home' },
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
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={onClose}
        />
      )}

      <nav className={`sidebar d-flex flex-column ${isOpen ? 'show' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <NavLink to="/" className="text-decoration-none" onClick={onClose}>
            <div className="d-flex align-items-center gap-2">
              <div className="brand-icon">
                <i className="fa-solid fa-house-chimney"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold text-white">Hatchery</h5>
                <small className="text-white-50">BC Housing</small>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Nav Links */}
        {isAuthenticated && (
          <div className="sidebar-nav flex-grow-1">
            <div className="px-3 py-2">
              <small className="text-uppercase text-white-50 fw-semibold letter-spacing">Menu</small>
            </div>
            <ul className="nav flex-column">
              {navItems.map(item => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
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
                <div className="px-3 py-2 mt-3">
                  <small className="text-uppercase text-white-50 fw-semibold letter-spacing">Admin</small>
                </div>
                <ul className="nav flex-column">
                  {adminItems.map(item => (
                    <li className="nav-item" key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`}
                        onClick={onClose}
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
              />
              <div className="flex-grow-1 min-w-0">
                <div className="text-white fw-semibold text-truncate small">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-white-50 text-truncate" style={{ fontSize: '0.7rem' }}>
                  {currentUser.email}
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-light border-0"
                onClick={logout}
                title="Sign out"
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
