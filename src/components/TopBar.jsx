import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ onMenuToggle, title }) {
  const { currentUser, isAuthenticated, allUsers, login, unreadMessageCount } = useApp();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-link text-dark d-lg-none p-0"
          onClick={onMenuToggle}
        >
          <i className="fa-solid fa-bars fs-5"></i>
        </button>
        <h5 className="mb-0 fw-semibold text-dark d-none d-md-block">{title}</h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Demo user switcher */}
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="fa-solid fa-users-gear me-1"></i>
            <span className="d-none d-sm-inline">Switch User</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><h6 className="dropdown-header">Demo: Switch User</h6></li>
            {allUsers.map(user => (
              <li key={user.id}>
                <button
                  className={`dropdown-item d-flex align-items-center gap-2 ${currentUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => login(user.id)}
                >
                  <img src={user.profileImage} alt="" className="rounded-circle" width="24" height="24" />
                  <div>
                    <div className="small fw-semibold">{user.firstName} {user.lastName}</div>
                    <div style={{ fontSize: '0.7rem' }} className="text-muted">{user.role}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications bell */}
        {isAuthenticated && (
          <button
            className="btn btn-link text-dark position-relative p-0"
            onClick={() => navigate('/messages')}
          >
            <i className="fa-solid fa-bell fs-5"></i>
            {unreadMessageCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                {unreadMessageCount}
              </span>
            )}
          </button>
        )}

        {/* User avatar */}
        {isAuthenticated && currentUser && (
          <div
            className="d-none d-md-flex align-items-center gap-2 cursor-pointer"
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={currentUser.profileImage}
              alt={currentUser.firstName}
              className="rounded-circle border"
              width="32"
              height="32"
            />
          </div>
        )}
      </div>
    </header>
  );
}
