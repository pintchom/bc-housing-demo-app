import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ListingCard({ listing, showActions = false }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, getUserById, updateListing } = useApp();
  const owner = getUserById(listing.ownerId);
  const fav = isFavorite(listing.id);

  const statusBadge = {
    available: 'bg-success',
    pending: 'bg-warning text-dark',
    rented: 'bg-secondary',
  };

  return (
    <div className="card listing-card h-100 border-0 shadow-sm">
      {/* Image */}
      <div className="position-relative">
        <img
          src={listing.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
          className="card-img-top listing-card-img"
          alt={listing.title}
          onClick={() => navigate(`/listings/${listing.id}`)}
          style={{ cursor: 'pointer' }}
        />
        <div className="position-absolute top-0 end-0 p-2">
          <button
            className={`btn btn-sm rounded-circle ${fav ? 'btn-danger' : 'btn-light'}`}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); }}
            style={{ width: 36, height: 36 }}
          >
            <i className={`fa-${fav ? 'solid' : 'regular'} fa-heart`}></i>
          </button>
        </div>
        <div className="position-absolute top-0 start-0 p-2 d-flex gap-1">
          <span className={`badge ${statusBadge[listing.status] || 'bg-info'}`}>
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </span>
          {listing.verified && (
            <span className="badge bg-primary">
              <i className="fa-solid fa-check me-1"></i>Verified
            </span>
          )}
        </div>
        <div className="position-absolute bottom-0 start-0 p-2">
          <span className="badge bg-dark bg-opacity-75 fs-6">
            ${listing.monthlyRent.toLocaleString()}/mo
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="card-body" onClick={() => navigate(`/listings/${listing.id}`)} style={{ cursor: 'pointer' }}>
        <h6 className="card-title fw-bold mb-1 text-truncate">{listing.title}</h6>
        <p className="text-muted small mb-2">
          <i className="fa-solid fa-location-dot me-1"></i>
          {listing.address}, {listing.city}
        </p>

        <div className="d-flex gap-3 text-muted small mb-2">
          <span><i className="fa-solid fa-bed me-1"></i>{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`}</span>
          <span><i className="fa-solid fa-bath me-1"></i>{listing.bathrooms} BA</span>
          <span><i className="fa-solid fa-ruler-combined me-1"></i>{listing.sqft} sqft</span>
        </div>

        <div className="d-flex gap-1 flex-wrap mb-2">
          <span className="badge bg-light text-dark border">{listing.leaseType}</span>
          <span className="badge bg-light text-dark border">{listing.propertyType}</span>
          {listing.furnished && <span className="badge bg-light text-dark border">Furnished</span>}
          {listing.petsAllowed && <span className="badge bg-light text-dark border">Pets OK</span>}
        </div>

        <p className="text-muted small mb-0">
          <i className="fa-regular fa-calendar me-1"></i>
          {new Date(listing.availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(listing.availableTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Owner footer */}
      <div className="card-footer bg-white border-top d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          {owner && (
            <>
              <img src={owner.profileImage} alt="" className="rounded-circle" width="24" height="24" />
              <small className="text-muted">{owner.firstName} {owner.lastName}</small>
            </>
          )}
        </div>
        <small className="text-muted">
          <i className="fa-regular fa-eye me-1"></i>{listing.views}
        </small>
      </div>

      {/* Owner actions */}
      {showActions && (
        <div className="card-footer bg-light border-top">
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary flex-fill"
              onClick={(e) => { e.stopPropagation(); navigate(`/listings/edit/${listing.id}`); }}
            >
              <i className="fa-solid fa-pen me-1"></i>Edit
            </button>
            {listing.status === 'available' ? (
              <button
                className="btn btn-sm btn-outline-warning flex-fill"
                onClick={(e) => { e.stopPropagation(); updateListing(listing.id, { status: 'pending' }); }}
              >
                <i className="fa-solid fa-eye-slash me-1"></i>Hide
              </button>
            ) : listing.status === 'pending' ? (
              <button
                className="btn btn-sm btn-outline-success flex-fill"
                onClick={(e) => { e.stopPropagation(); updateListing(listing.id, { status: 'available' }); }}
              >
                <i className="fa-solid fa-eye me-1"></i>Show
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
