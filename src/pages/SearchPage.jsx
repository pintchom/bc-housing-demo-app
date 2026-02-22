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

export default function SearchPage() {
  const navigate = useNavigate();
  const { listings } = useApp();

  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    leaseType: '',
    furnished: '',
    petsAllowed: '',
    parking: '',
    status: 'available',
  });

  const [viewMode, setViewMode] = useState('grid'); // grid | map | split
  const [showFilters, setShowFilters] = useState(true);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '', minPrice: '', maxPrice: '', bedrooms: '',
      propertyType: '', leaseType: '', furnished: '', petsAllowed: '',
      parking: '', status: 'available',
    });
  };

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      if (filters.status && l.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!l.title.toLowerCase().includes(q) &&
            !l.address.toLowerCase().includes(q) &&
            !l.city.toLowerCase().includes(q) &&
            !l.description.toLowerCase().includes(q)) return false;
      }
      if (filters.minPrice && l.monthlyRent < Number(filters.minPrice)) return false;
      if (filters.maxPrice && l.monthlyRent > Number(filters.maxPrice)) return false;
      if (filters.bedrooms && l.bedrooms !== Number(filters.bedrooms)) return false;
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false;
      if (filters.leaseType && l.leaseType !== filters.leaseType) return false;
      if (filters.furnished === 'yes' && !l.furnished) return false;
      if (filters.furnished === 'no' && l.furnished) return false;
      if (filters.petsAllowed === 'yes' && !l.petsAllowed) return false;
      if (filters.petsAllowed === 'no' && l.petsAllowed) return false;
      if (filters.parking === 'yes' && !l.parking) return false;
      if (filters.parking === 'no' && l.parking) return false;
      return true;
    });
  }, [listings, filters]);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && k !== 'status').length;

  return (
    <div>
      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-3">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="fa-solid fa-magnifying-glass text-muted"></i></span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by location, title, or keyword..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="col-auto">
              <button
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'} position-relative`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="fa-solid fa-sliders me-1"></i> Filters
                {activeFilterCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
            <div className="col-auto">
              <div className="btn-group">
                <button className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('grid')}>
                  <i className="fa-solid fa-grid-2"></i>
                </button>
                <button className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('map')}>
                  <i className="fa-solid fa-map"></i>
                </button>
                <button className={`btn ${viewMode === 'split' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('split')}>
                  <i className="fa-solid fa-table-columns"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Min Price</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">$</span>
                  <input type="number" className="form-control" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="0" />
                </div>
              </div>
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Max Price</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">$</span>
                  <input type="number" className="form-control" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="5000" />
                </div>
              </div>
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Bedrooms</label>
                <select className="form-select form-select-sm" name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option value="0">Studio</option>
                  <option value="1">1 BR</option>
                  <option value="2">2 BR</option>
                  <option value="3">3+ BR</option>
                </select>
              </div>
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Property Type</label>
                <select className="form-select form-select-sm" name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Studio</option>
                  <option>Room</option>
                </select>
              </div>
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Lease Type</label>
                <select className="form-select form-select-sm" name="leaseType" value={filters.leaseType} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option>Sublease</option>
                  <option>Short-term</option>
                  <option>Full Lease</option>
                </select>
              </div>
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Furnished</label>
                <select className="form-select form-select-sm" name="furnished" value={filters.furnished} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option value="yes">Furnished</option>
                  <option value="no">Unfurnished</option>
                </select>
              </div>
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Pets</label>
                <select className="form-select form-select-sm" name="petsAllowed" value={filters.petsAllowed} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option value="yes">Pets Allowed</option>
                  <option value="no">No Pets</option>
                </select>
              </div>
              <div className="col-md-3 col-6">
                <label className="form-label small fw-semibold">Parking</label>
                <select className="form-select form-select-sm" name="parking" value={filters.parking} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option value="yes">Has Parking</option>
                  <option value="no">No Parking</option>
                </select>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <small className="text-muted">{filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found</small>
              <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
                <i className="fa-solid fa-xmark me-1"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="row g-3">
        {/* Map (shown in map or split mode) */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'col-md-6' : 'col-12'}>
            <div className="card border-0 shadow-sm">
              <MapContainer
                center={[42.3382, -71.1530]}
                zoom={14}
                style={{ height: viewMode === 'map' ? 600 : 500 }}
                className="rounded"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredListings.map(listing => (
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
        )}

        {/* Grid (shown in grid or split mode) */}
        {(viewMode === 'grid' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'col-md-6' : 'col-12'}>
            {filteredListings.length === 0 ? (
              <div className="text-center py-5">
                <i className="fa-solid fa-magnifying-glass fs-1 text-muted mb-3 d-block"></i>
                <h5 className="text-muted">No listings found</h5>
                <p className="text-muted">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="row g-3" style={viewMode === 'split' ? { maxHeight: 500, overflowY: 'auto' } : {}}>
                {filteredListings.map(listing => (
                  <div key={listing.id} className={viewMode === 'split' ? 'col-12' : 'col-md-6 col-lg-4'}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
