import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function Dashboard() {
  const navigate = useNavigate();
  const { listings, currentUser, myApplications, myFavoriteListings, myListings, unreadMessageCount } = useApp();

  const availableListings = useMemo(() => listings.filter(l => l.status === 'available'), [listings]);
  const recentListings = useMemo(() =>
    [...availableListings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [availableListings]
  );

  const pendingApps = myApplications.filter(a => a.status === 'pending').length;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card border-0 bg-maroon text-white mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h4 className="fw-bold mb-1">Welcome back, {currentUser?.firstName}! 👋</h4>
              <p className="mb-0 opacity-75">Find your perfect BC sublet or list your place for the summer.</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button className="btn btn-warning fw-semibold" onClick={() => navigate('/search')}>
                <i className="fa-solid fa-magnifying-glass me-2"></i>Browse Listings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/search')}>
            <div className="card-body text-center">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary mx-auto mb-2">
                <i className="fa-solid fa-building"></i>
              </div>
              <h4 className="fw-bold mb-0">{availableListings.length}</h4>
              <small className="text-muted">Available Listings</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/applications')}>
            <div className="card-body text-center">
              <div className="stat-icon bg-warning bg-opacity-10 text-warning mx-auto mb-2">
                <i className="fa-solid fa-file-lines"></i>
              </div>
              <h4 className="fw-bold mb-0">{pendingApps}</h4>
              <small className="text-muted">Pending Applications</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/favorites')}>
            <div className="card-body text-center">
              <div className="stat-icon bg-danger bg-opacity-10 text-danger mx-auto mb-2">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h4 className="fw-bold mb-0">{myFavoriteListings.length}</h4>
              <small className="text-muted">Saved Listings</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/messages')}>
            <div className="card-body text-center">
              <div className="stat-icon bg-success bg-opacity-10 text-success mx-auto mb-2">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <h4 className="fw-bold mb-0">{unreadMessageCount}</h4>
              <small className="text-muted">Unread Messages</small>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">
            <i className="fa-solid fa-map-location-dot me-2 text-primary"></i>
            Listings Near BC
          </h6>
          <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/search')}>
            View All <i className="fa-solid fa-arrow-right ms-1"></i>
          </button>
        </div>
        <div className="card-body p-0">
          <MapContainer
            center={[42.3382, -71.1530]}
            zoom={14}
            style={{ height: 350 }}
            className="rounded-bottom"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {availableListings.map(listing => (
              <Marker key={listing.id} position={[listing.lat, listing.lng]}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong>{listing.title}</strong><br />
                    <span className="text-success fw-bold">${listing.monthlyRent}/mo</span><br />
                    <small>{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`} &bull; {listing.propertyType}</small><br />
                    <button
                      className="btn btn-sm btn-maroon mt-1 w-100"
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Recent Listings</h5>
        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/search')}>
          See All
        </button>
      </div>
      <div className="row g-3 mb-4">
        {recentListings.map(listing => (
          <div key={listing.id} className="col-md-6 col-lg-3">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}
