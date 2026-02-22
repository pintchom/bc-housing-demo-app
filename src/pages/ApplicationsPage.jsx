import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const { myApplications, receivedApplications, listings, getUserById, updateApplicationStatus } = useApp();
  const [tab, setTab] = useState('submitted');

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-warning text-dark',
      accepted: 'bg-success',
      declined: 'bg-danger',
      withdrawn: 'bg-secondary',
    };
    return map[status] || 'bg-info';
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Applications</h4>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'submitted' ? 'active' : ''}`} onClick={() => setTab('submitted')}>
            <i className="fa-solid fa-paper-plane me-1"></i>
            My Applications
            <span className="badge bg-primary ms-1">{myApplications.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
            <i className="fa-solid fa-inbox me-1"></i>
            Received
            <span className="badge bg-primary ms-1">{receivedApplications.length}</span>
          </button>
        </li>
      </ul>

      {/* Submitted Applications */}
      {tab === 'submitted' && (
        <>
          {myApplications.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-file-lines fs-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">No applications yet</h5>
              <p className="text-muted">Browse listings and apply for places you like.</p>
              <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse Listings</button>
            </div>
          ) : (
            <div className="row g-3">
              {myApplications.map(app => {
                const listing = listings.find(l => l.id === app.listingId);
                const owner = listing ? getUserById(listing.ownerId) : null;
                return (
                  <div key={app.id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <img
                              src={listing?.images?.[0]}
                              alt=""
                              className="rounded w-100"
                              style={{ height: 80, objectFit: 'cover', cursor: 'pointer' }}
                              onClick={() => navigate(`/listings/${listing?.id}`)}
                            />
                          </div>
                          <div className="col-md-4">
                            <h6 className="fw-bold mb-1" style={{ cursor: 'pointer' }} onClick={() => navigate(`/listings/${listing?.id}`)}>
                              {listing?.title}
                            </h6>
                            <small className="text-muted">
                              <i className="fa-solid fa-location-dot me-1"></i>
                              {listing?.address}, {listing?.city}
                            </small>
                            <div className="small text-muted mt-1">
                              Listed by {owner?.firstName} {owner?.lastName}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="small">
                              <div><strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}</div>
                              <div><strong>Dates:</strong> {new Date(app.requestedFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(app.requestedTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                              <div><strong>Rent:</strong> ${listing?.monthlyRent}/mo</div>
                            </div>
                          </div>
                          <div className="col-md-3 text-md-end">
                            <span className={`badge ${getStatusBadge(app.status)} mb-2`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                            {app.status === 'accepted' && (
                              <div>
                                <button className="btn btn-sm btn-outline-success">
                                  <i className="fa-solid fa-file-pdf me-1"></i>Download Agreement
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {app.message && (
                          <div className="mt-2 p-2 bg-light rounded small text-muted">
                            <i className="fa-solid fa-quote-left me-1"></i>
                            {app.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Received Applications */}
      {tab === 'received' && (
        <>
          {receivedApplications.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-inbox fs-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">No applications received</h5>
              <p className="text-muted">Create a listing to start receiving applications.</p>
            </div>
          ) : (
            <div className="row g-3">
              {receivedApplications.map(app => {
                const listing = listings.find(l => l.id === app.listingId);
                const applicant = getUserById(app.applicantId);
                return (
                  <div key={app.id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-1">
                            <img src={applicant?.profileImage} alt="" className="rounded-circle" width="48" height="48" />
                          </div>
                          <div className="col-md-3">
                            <h6 className="fw-bold mb-0">{applicant?.firstName} {applicant?.lastName}</h6>
                            <small className="text-muted">{applicant?.year} &bull; {applicant?.major}</small>
                            <div className="text-warning small">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-${i < Math.round(applicant?.avgRating || 0) ? 'solid' : 'regular'} fa-star`}></i>
                              ))}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted d-block">Applied for:</small>
                            <strong className="small" style={{ cursor: 'pointer' }} onClick={() => navigate(`/listings/${listing?.id}`)}>
                              {listing?.title}
                            </strong>
                          </div>
                          <div className="col-md-2">
                            <div className="small">
                              <div>{new Date(app.requestedFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(app.requestedTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                              <div className="text-muted">{new Date(app.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="col-md-3 text-md-end">
                            {app.status === 'pending' ? (
                              <div className="d-flex gap-1 justify-content-md-end">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                >
                                  <i className="fa-solid fa-check me-1"></i>Accept
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => updateApplicationStatus(app.id, 'declined')}
                                >
                                  <i className="fa-solid fa-xmark me-1"></i>Decline
                                </button>
                              </div>
                            ) : (
                              <span className={`badge ${getStatusBadge(app.status)}`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        {app.message && (
                          <div className="mt-2 p-2 bg-light rounded small text-muted">
                            <i className="fa-solid fa-quote-left me-1"></i>
                            {app.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
