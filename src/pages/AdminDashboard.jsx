import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { listings, applications, allUsers, reports, getUserById, currentUser } = useApp();

  const stats = useMemo(() => ({
    totalListings: listings.length,
    available: listings.filter(l => l.status === 'available').length,
    pending: listings.filter(l => l.status === 'pending').length,
    rented: listings.filter(l => l.status === 'rented').length,
    totalUsers: allUsers.filter(u => u.role !== 'admin').length,
    verifiedUsers: allUsers.filter(u => u.verified && u.role !== 'admin').length,
    totalApplications: applications.length,
    pendingApps: applications.filter(a => a.status === 'pending').length,
    acceptedApps: applications.filter(a => a.status === 'accepted').length,
    avgRent: Math.round(listings.reduce((sum, l) => sum + l.monthlyRent, 0) / listings.length),
    pendingReports: reports.filter(r => r.status === 'pending').length,
  }), [listings, applications, allUsers, reports]);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-5">
        <i className="fa-solid fa-lock fs-1 text-muted mb-3 d-block"></i>
        <h4 className="text-muted">Access Denied</h4>
        <p className="text-muted">You need admin privileges to access this page.</p>
        <p className="text-muted small">Use the "Switch User" button to log in as Admin for demo purposes.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Admin Dashboard</h4>
          <p className="text-muted mb-0">Platform overview and moderation tools</p>
        </div>
        <span className="badge bg-danger fs-6">
          <i className="fa-solid fa-shield-halved me-1"></i>Admin
        </span>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fw-bold mb-0">{stats.totalListings}</h3>
                  <small className="opacity-75">Total Listings</small>
                </div>
                <i className="fa-solid fa-building fs-3 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                  <small className="opacity-75">Registered Students</small>
                </div>
                <i className="fa-solid fa-users fs-3 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fw-bold mb-0">{stats.totalApplications}</h3>
                  <small className="opacity-75">Applications</small>
                </div>
                <i className="fa-solid fa-file-lines fs-3 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fw-bold mb-0">${stats.avgRent}</h3>
                  <small className="opacity-75">Avg Monthly Rent</small>
                </div>
                <i className="fa-solid fa-dollar-sign fs-3 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Listings Breakdown */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h6 className="mb-0 fw-bold">Listings Overview</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Available</span>
                <div className="d-flex align-items-center gap-2">
                  <div className="progress flex-grow-1" style={{ width: 150, height: 8 }}>
                    <div className="progress-bar bg-success" style={{ width: `${(stats.available / stats.totalListings) * 100}%` }}></div>
                  </div>
                  <strong>{stats.available}</strong>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Pending Review</span>
                <div className="d-flex align-items-center gap-2">
                  <div className="progress flex-grow-1" style={{ width: 150, height: 8 }}>
                    <div className="progress-bar bg-warning" style={{ width: `${(stats.pending / stats.totalListings) * 100}%` }}></div>
                  </div>
                  <strong>{stats.pending}</strong>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Rented</span>
                <div className="d-flex align-items-center gap-2">
                  <div className="progress flex-grow-1" style={{ width: 150, height: 8 }}>
                    <div className="progress-bar bg-secondary" style={{ width: `${(stats.rented / stats.totalListings) * 100}%` }}></div>
                  </div>
                  <strong>{stats.rented}</strong>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span>Verified Listings</span>
                <strong>{listings.filter(l => l.verified).length} / {stats.totalListings}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Breakdown */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h6 className="mb-0 fw-bold">Applications Overview</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span><span className="badge bg-warning text-dark me-1">Pending</span></span>
                <strong>{stats.pendingApps}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span><span className="badge bg-success me-1">Accepted</span></span>
                <strong>{stats.acceptedApps}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span><span className="badge bg-danger me-1">Declined</span></span>
                <strong>{applications.filter(a => a.status === 'declined').length}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span>Acceptance Rate</span>
                <strong>
                  {stats.totalApplications > 0
                    ? Math.round((stats.acceptedApps / stats.totalApplications) * 100)
                    : 0}%
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Reports */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">
                Pending Reports
                {stats.pendingReports > 0 && (
                  <span className="badge bg-danger ms-2">{stats.pendingReports}</span>
                )}
              </h6>
            </div>
            <div className="card-body">
              {reports.filter(r => r.status === 'pending').length === 0 ? (
                <p className="text-muted text-center mb-0">No pending reports</p>
              ) : (
                reports.filter(r => r.status === 'pending').map(report => {
                  const reporter = getUserById(report.reporterId);
                  return (
                    <div key={report.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                      <div className={`badge ${report.type === 'listing' ? 'bg-warning text-dark' : 'bg-danger'} align-self-start`}>
                        {report.type === 'listing' ? (
                          <i className="fa-solid fa-building"></i>
                        ) : (
                          <i className="fa-solid fa-user"></i>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <strong className="small text-capitalize">{report.type} Report</strong>
                          <small className="text-muted">{new Date(report.createdAt).toLocaleDateString()}</small>
                        </div>
                        <p className="small text-muted mb-1">{report.reason}</p>
                        <small className="text-muted">Reported by: {reporter?.firstName} {reporter?.lastName}</small>
                      </div>
                      <div className="d-flex gap-1 align-self-start">
                        <button className="btn btn-sm btn-outline-success"><i className="fa-solid fa-check"></i></button>
                        <button className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-xmark"></i></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h6 className="mb-0 fw-bold">Registered Users</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small">User</th>
                      <th className="small">Role</th>
                      <th className="small">Status</th>
                      <th className="small">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.filter(u => u.role !== 'admin').map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={user.profileImage} alt="" className="rounded-circle" width="28" height="28" />
                            <div>
                              <div className="small fw-semibold">{user.firstName} {user.lastName}</div>
                              <div className="text-muted" style={{ fontSize: '0.7rem' }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><small className="text-capitalize">{user.role}</small></td>
                        <td>
                          {user.verified ? (
                            <span className="badge bg-success">Verified</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Unverified</span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" title="Suspend User">
                            <i className="fa-solid fa-ban"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
