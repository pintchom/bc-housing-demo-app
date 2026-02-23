import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createPriceIcon = (price) => L.divIcon({
  className: '',
  html: `<div class="price-marker-label">$${price.toLocaleString()}</div>`,
  iconSize: [0, 0],
  popupAnchor: [0, -32],
});

const BC_CENTER = [42.3382, -71.1530];

const getDistanceFromBC = (lat, lng) => {
  const R = 3959;
  const dLat = (lat - BC_CENTER[0]) * Math.PI / 180;
  const dLng = (lng - BC_CENTER[1]) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(BC_CENTER[0] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { listings, myApplications, myFavoriteListings, unreadMessageCount } = useApp();

  const availableListings = useMemo(() => listings.filter(l => l.status === 'available'), [listings]);
  const recentListings = useMemo(() =>
    [...availableListings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [availableListings]
  );

  const pendingApps = myApplications.filter(a => a.status === 'pending').length;

  const [mapFilters, setMapFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    radius: '',
    furnished: false,
    parking: false,
    pets: false,
  });

  const handleMapFilterChange = (e) => {
    const { name, value } = e.target;
    setMapFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleMapFilter = (key) => {
    setMapFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearMapFilters = () => {
    setMapFilters({ minPrice: '', maxPrice: '', bedrooms: '', radius: '', furnished: false, parking: false, pets: false });
  };

  const hasActiveMapFilters = mapFilters.minPrice || mapFilters.maxPrice || mapFilters.bedrooms || mapFilters.radius || mapFilters.furnished || mapFilters.parking || mapFilters.pets;

  const filteredMapListings = useMemo(() => {
    return availableListings.filter(listing => {
      if (mapFilters.minPrice && listing.monthlyRent < Number(mapFilters.minPrice)) return false;
      if (mapFilters.maxPrice && listing.monthlyRent > Number(mapFilters.maxPrice)) return false;
      if (mapFilters.bedrooms && listing.bedrooms !== Number(mapFilters.bedrooms)) return false;
      if (mapFilters.radius && getDistanceFromBC(listing.lat, listing.lng) > Number(mapFilters.radius)) return false;
      if (mapFilters.furnished && !listing.furnished) return false;
      if (mapFilters.parking && !listing.parking) return false;
      if (mapFilters.pets && !listing.petsAllowed) return false;
      return true;
    });
  }, [availableListings, mapFilters]);

  return (
    <div>
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

      {/* Map Section with Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom py-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0 fw-bold">
              <i className="fa-solid fa-map-location-dot me-2 text-primary"></i>
              Listings Near BC
              <span className="badge bg-primary bg-opacity-10 text-primary ms-2 fw-normal small">
                {filteredMapListings.length}
              </span>
            </h6>
            {hasActiveMapFilters && (
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearMapFilters}>
                <i className="fa-solid fa-xmark me-1"></i>Clear
              </button>
            )}
          </div>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <div className="input-group input-group-sm" style={{ width: 200 }}>
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                placeholder="Min"
                name="minPrice"
                value={mapFilters.minPrice}
                onChange={handleMapFilterChange}
              />
              <span className="input-group-text">–</span>
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                name="maxPrice"
                value={mapFilters.maxPrice}
                onChange={handleMapFilterChange}
              />
            </div>
            <select
              className="form-select form-select-sm"
              style={{ width: 100 }}
              name="bedrooms"
              value={mapFilters.bedrooms}
              onChange={handleMapFilterChange}
            >
              <option value="">Beds</option>
              <option value="0">Studio</option>
              <option value="1">1 BR</option>
              <option value="2">2 BR</option>
              <option value="3">3+ BR</option>
            </select>
            <select
              className="form-select form-select-sm"
              style={{ width: 120 }}
              name="radius"
              value={mapFilters.radius}
              onChange={handleMapFilterChange}
            >
              <option value="">Radius</option>
              <option value="0.25">0.25 mi</option>
              <option value="0.5">0.5 mi</option>
              <option value="1">1 mi</option>
              <option value="2">2 mi</option>
              <option value="5">5 mi</option>
            </select>
            <button
              type="button"
              className={`btn btn-sm ${mapFilters.furnished ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => toggleMapFilter('furnished')}
            >
              <i className="fa-solid fa-couch me-1"></i>Furnished
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapFilters.parking ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => toggleMapFilter('parking')}
            >
              <i className="fa-solid fa-car me-1"></i>Parking
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapFilters.pets ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => toggleMapFilter('pets')}
            >
              <i className="fa-solid fa-paw me-1"></i>Pets
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <MapContainer
            center={BC_CENTER}
            zoom={14}
            style={{ height: 450 }}
            className="rounded-bottom"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredMapListings.map(listing => (
              <Marker key={listing.id} position={[listing.lat, listing.lng]} icon={createPriceIcon(listing.monthlyRent)}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong>{listing.title}</strong><br />
                    <span className="text-success fw-bold">${listing.monthlyRent}/mo</span><br />
                    <small>{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`} &bull; {listing.propertyType}</small><br />
                    <button
                      type="button"
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
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => navigate('/search')}>
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
