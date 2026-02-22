import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';

export default function MyListings() {
  const navigate = useNavigate();
  const { myListings } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = statusFilter === 'all'
    ? myListings
    : myListings.filter(l => l.status === statusFilter);

  const counts = {
    all: myListings.length,
    available: myListings.filter(l => l.status === 'available').length,
    pending: myListings.filter(l => l.status === 'pending').length,
    rented: myListings.filter(l => l.status === 'rented').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">My Listings</h4>
          <p className="text-muted mb-0">Manage your property listings</p>
        </div>
        <button className="btn btn-maroon" onClick={() => navigate('/listings/create')}>
          <i className="fa-solid fa-plus me-2"></i>Create Listing
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-2">
          <ul className="nav nav-pills">
            {['all', 'available', 'pending', 'rented'].map(status => (
              <li className="nav-item" key={status}>
                <button
                  className={`nav-link ${statusFilter === status ? 'active bg-maroon' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="badge bg-white text-dark ms-1">{counts[status]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-solid fa-building fs-1 text-muted mb-3 d-block"></i>
          <h5 className="text-muted">No listings yet</h5>
          <p className="text-muted">Create your first listing to start finding subletters.</p>
          <button className="btn btn-maroon" onClick={() => navigate('/listings/create')}>
            <i className="fa-solid fa-plus me-2"></i>Create Listing
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(listing => (
            <div key={listing.id} className="col-md-6 col-lg-4">
              <ListingCard listing={listing} showActions />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
