import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, getUserById, submitApplication, currentUser } = useApp();
  const listing = listings.find(l => l.id === Number(id));
  const owner = listing ? getUserById(listing.ownerId) : null;

  const [form, setForm] = useState({
    message: '',
    requestedFrom: listing?.availableFrom || '',
    requestedTo: listing?.availableTo || '',
    agreeTerms: false,
  });

  if (!listing) {
    return (
      <div className="text-center py-5">
        <h4>Listing not found</h4>
        <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse Listings</button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitApplication({
      listingId: listing.id,
      message: form.message,
      requestedFrom: form.requestedFrom,
      requestedTo: form.requestedTo,
    });
    navigate('/applications');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        {/* Listing summary */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex gap-3">
              <img
                src={listing.images?.[0]}
                alt={listing.title}
                className="rounded"
                style={{ width: 120, height: 90, objectFit: 'cover' }}
              />
              <div>
                <h5 className="fw-bold mb-1">{listing.title}</h5>
                <p className="text-muted small mb-1">
                  <i className="fa-solid fa-location-dot me-1"></i>{listing.address}, {listing.city}
                </p>
                <span className="fw-bold text-success">${listing.monthlyRent}/mo</span>
                <span className="text-muted ms-2">
                  {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`} &bull; {listing.propertyType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Application form */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h4 className="fw-bold mb-1">Apply for This Listing</h4>
            <p className="text-muted mb-4">Send your application to {owner?.firstName} {owner?.lastName}</p>

            <form onSubmit={handleSubmit}>
              {/* Applicant Info */}
              <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Your Information</h6>
                  <div className="d-flex align-items-center gap-3">
                    <img src={currentUser?.profileImage} alt="" className="rounded-circle" width="48" height="48" />
                    <div>
                      <strong>{currentUser?.firstName} {currentUser?.lastName}</strong>
                      <div className="text-muted small">{currentUser?.email}</div>
                      <div className="text-muted small">{currentUser?.year} &bull; {currentUser?.major}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Requested Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.requestedFrom}
                    onChange={e => setForm(prev => ({ ...prev, requestedFrom: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Requested End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.requestedTo}
                    onChange={e => setForm(prev => ({ ...prev, requestedTo: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Message to Lister</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Introduce yourself and explain why you're a great fit for this sublet..."
                  required
                />
                <div className="form-text">Tip: Mention your habits, schedule, and why this listing interests you.</div>
              </div>

              {/* Agreement preview */}
              <div className="card border mb-3">
                <div className="card-header bg-white">
                  <h6 className="mb-0 fw-bold">
                    <i className="fa-solid fa-file-contract me-2"></i>Sublet Agreement Preview
                  </h6>
                </div>
                <div className="card-body small text-muted">
                  <p>By applying, you acknowledge the following terms:</p>
                  <ul className="mb-0">
                    <li>Monthly rent of <strong>${listing.monthlyRent}</strong> is due on the 1st of each month</li>
                    <li>Security deposit of <strong>${listing.securityDeposit}</strong> required upon signing</li>
                    {listing.landlordApprovalRequired && <li>This sublet requires landlord approval</li>}
                    <li>Lease period: {form.requestedFrom || '—'} to {form.requestedTo || '—'}</li>
                    {listing.rules?.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                  <p className="mt-2 mb-0 text-info">
                    <i className="fa-solid fa-info-circle me-1"></i>
                    A full sublet agreement PDF will be generated upon acceptance.
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={e => setForm(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  id="agreeTerms"
                  required
                />
                <label className="form-check-label small" htmlFor="agreeTerms">
                  I agree to the platform terms and understand this application is not binding until both parties sign the sublet agreement.
                </label>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-maroon flex-fill fw-semibold">
                  <i className="fa-solid fa-paper-plane me-2"></i>Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
