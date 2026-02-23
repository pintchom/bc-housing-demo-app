import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, getUserById, toggleFavorite, isFavorite, reviews, currentUser, applications } = useApp();

  const listing = listings.find(l => l.id === Number(id));
  const owner = listing ? getUserById(listing.ownerId) : null;
  const fav = listing ? isFavorite(listing.id) : false;
  const [activeImage, setActiveImage] = useState(0);

  const ownerReviews = useMemo(() => {
    if (!owner) return [];
    return reviews.filter(r => r.reviewedUserId === owner.id);
  }, [reviews, owner]);

  const hasApplied = useMemo(() => {
    if (!listing || !currentUser) return false;
    return applications.some(a => a.listingId === listing.id && a.applicantId === currentUser.id);
  }, [applications, listing, currentUser]);

  const isOwner = listing?.ownerId === currentUser?.id;

  if (!listing) {
    return (
      <div className="text-center py-5">
        <h4>Listing not found</h4>
        <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse Listings</button>
      </div>
    );
  }

  const totalUpfront = listing.securityDeposit + listing.brokerFee + listing.applicationFee +
    (listing.utilitiesIncluded ? 0 : listing.estimatedUtilities) + listing.monthlyRent;

  const statusBadge = {
    available: 'bg-success',
    pending: 'bg-warning text-dark',
    rented: 'bg-secondary',
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><a href="#" onClick={(e) => { e.preventDefault(); navigate('/search'); }}>Listings</a></li>
          <li className="breadcrumb-item active">{listing.title}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column - Images & Details */}
        <div className="col-lg-8">
          {/* Image Gallery */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="position-relative">
              <img
                src={listing.images?.[activeImage] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                className="card-img-top"
                alt={listing.title}
                style={{ height: 400, objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                <button
                  className={`btn ${fav ? 'btn-danger' : 'btn-light'} rounded-circle shadow-sm d-flex align-items-center justify-content-center`}
                  onClick={() => toggleFavorite(listing.id)}
                  style={{ width: 40, height: 40 }}
                >
                  <i className={`fa-${fav ? 'solid' : 'regular'} fa-heart`}></i>
                </button>

                <button
                  className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40 }}
                >
                  <i className="fa-solid fa-share-nodes"></i>
                </button>

                <button
                  className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40 }}
                  title="Report listing"
                >
                  <i className="fa-solid fa-flag"></i>
                </button>
              </div>
              <div className="position-absolute top-0 start-0 p-3 d-flex gap-1">
                <span className={`badge ${statusBadge[listing.status]}`}>{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</span>
                {listing.verified && <span className="badge bg-primary"><i className="fa-solid fa-check me-1"></i>Verified</span>}
              </div>
            </div>
            {/* Thumbnails */}
            {listing.images?.length > 1 && (
              <div className="card-body d-flex gap-2 overflow-auto py-2 px-3">
                {listing.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={`rounded cursor-pointer ${i === activeImage ? 'border border-2 border-primary' : 'opacity-75'}`}
                    style={{ width: 80, height: 60, objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setActiveImage(i)}
                    alt={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title & Quick Info */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1">{listing.title}</h4>
                  <p className="text-muted mb-0">
                    <i className="fa-solid fa-location-dot me-1"></i>
                    {listing.address}, {listing.city}, {listing.state} {listing.zip}
                  </p>
                </div>
                <div className="text-end">
                  <h3 className="fw-bold text-success mb-0">${listing.monthlyRent.toLocaleString()}</h3>
                  <small className="text-muted">per month</small>
                </div>
              </div>

              <hr />

              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4 text-center">

                <div className="col">
                  <div className="p-3 h-100 border rounded-3 bg-light d-flex flex-column justify-content-center align-items-center">
                    <i className="fa-solid fa-bed fs-4 mb-2 text-secondary"></i>
                    <div className="fw-semibold fs-5">
                      {listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}
                    </div>
                    {listing.bedrooms !== 0 && (
                      <small className="text-muted">Bedrooms</small>
                    )}
                  </div>
                </div>

                <div className="col">
                  <div className="p-3 h-100 border rounded-3 bg-light d-flex flex-column justify-content-center align-items-center">
                    <i className="fa-solid fa-bath fs-4 mb-2 text-secondary"></i>
                    <div className="fw-semibold fs-5">{listing.bathrooms}</div>
                    <small className="text-muted">Bathrooms</small>
                  </div>
                </div>

                <div className="col">
                  <div className="p-3 h-100 border rounded-3 bg-light d-flex flex-column justify-content-center align-items-center">
                    <i className="fa-solid fa-ruler-combined fs-4 mb-2 text-secondary"></i>
                    <div className="fw-semibold fs-5">{listing.sqft}</div>
                    <small className="text-muted">Sq Ft</small>
                  </div>
                </div>

                <div className="col">
                  <div className="p-3 h-100 border rounded-3 bg-light d-flex flex-column justify-content-center align-items-center">
                    <i className="fa-solid fa-stairs fs-4 mb-2 text-secondary"></i>
                    <div className="fw-semibold fs-5">{listing.floor}</div>
                    <small className="text-muted">Floor</small>
                  </div>
                </div>

                <div className="col">
                  <div className="p-3 h-100 border rounded-3 bg-light d-flex flex-column justify-content-center align-items-center">
                    <i className="fa-solid fa-calendar fs-4 mb-2 text-secondary"></i>
                    <div className="fw-semibold fs-5">{listing.leaseType}</div>
                    <small className="text-muted">Lease Type</small>
                  </div>
                </div>

                </div>
            </div>
          </div>

          {/* Description */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">About This Place</h5>
              <p className="text-muted">{listing.description}</p>

              <h6 className="fw-bold mt-4 mb-2">Amenities</h6>
              <div className="d-flex gap-2 flex-wrap mb-3">
                {listing.amenities?.map((a, i) => (
                  <span key={i} className="badge bg-light text-dark border py-2 px-3">
                    <i className="fa-solid fa-check text-success me-1"></i>{a}
                  </span>
                ))}
                {listing.furnished && (
                  <span className="badge bg-light text-dark border py-2 px-3">
                    <i className="fa-solid fa-couch text-success me-1"></i>Furnished
                  </span>
                )}
                {listing.parking && (
                  <span className="badge bg-light text-dark border py-2 px-3">
                    <i className="fa-solid fa-car text-success me-1"></i>Parking
                  </span>
                )}
                {listing.petsAllowed && (
                  <span className="badge bg-light text-dark border py-2 px-3">
                    <i className="fa-solid fa-paw text-success me-1"></i>Pets OK
                  </span>
                )}
                <span className="badge bg-light text-dark border py-2 px-3">
                  <i className="fa-solid fa-shirt text-muted me-1"></i>Laundry: {listing.laundry}
                </span>
              </div>

              {listing.rules?.length > 0 && (
                <>
                  <h6 className="fw-bold mt-4 mb-2">House Rules</h6>
                  <ul className="list-unstyled">
                    {listing.rules.map((r, i) => (
                      <li key={i} className="mb-1">
                        <i className="fa-solid fa-circle-info text-warning me-2"></i>{r}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {listing.requirements?.length > 0 && (
                <>
                  <h6 className="fw-bold mt-4 mb-2">Requirements</h6>
                  <ul className="list-unstyled">
                    {listing.requirements.map((r, i) => (
                      <li key={i} className="mb-1">
                        <i className="fa-solid fa-user-check text-primary me-2"></i>{r}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Availability & Map */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Location & Availability</h5>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa-regular fa-calendar-check text-success fs-5"></i>
                    <div>
                      <small className="text-muted d-block">Available From</small>
                      <strong>{new Date(listing.availableFrom).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa-regular fa-calendar-xmark text-danger fs-5"></i>
                    <div>
                      <small className="text-muted d-block">Available Until</small>
                      <strong>{new Date(listing.availableTo).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                    </div>
                  </div>
                </div>
              </div>
              {listing.landlordApprovalRequired && (
                <div className="alert alert-info small mb-3">
                  <i className="fa-solid fa-circle-info me-1"></i>
                  Landlord approval is required for this sublet.
                </div>
              )}
              <MapContainer
                center={[listing.lat, listing.lng]}
                zoom={15}
                style={{ height: 250 }}
                className="rounded"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[listing.lat, listing.lng]}>
                  <Popup>{listing.address}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Owner Reviews */}
          {ownerReviews.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Reviews for {owner?.firstName}</h5>
                {ownerReviews.map(review => {
                  const reviewer = getUserById(review.reviewerId);
                  return (
                    <div key={review.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                      <img src={reviewer?.profileImage} alt="" className="rounded-circle" width="40" height="40" />
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <strong className="small">{reviewer?.firstName} {reviewer?.lastName}</strong>
                          <div className="text-warning small">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fa-${i < review.rating ? 'solid' : 'regular'} fa-star`}></i>
                            ))}
                          </div>
                          <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                        </div>
                        <p className="text-muted small mb-0 mt-1">{review.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-lg-4">
          {/* Cost Breakdown */}
          <div className="card border-0 shadow-sm mb-4 sticky-top" style={{ top: '5rem' }}>
            <div className="card-body">
              <h5 className="fw-bold mb-3">Cost Breakdown</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Monthly Rent</span>
                <strong>${listing.monthlyRent.toLocaleString()}</strong>
              </div>
              {!listing.utilitiesIncluded && listing.estimatedUtilities > 0 && (
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Est. Utilities</span>
                  <span>~${listing.estimatedUtilities}</span>
                </div>
              )}
              {listing.utilitiesIncluded && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Utilities</span>
                  <span>Included</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span>Security Deposit</span>
                <span>${listing.securityDeposit.toLocaleString()}</span>
              </div>
              {listing.brokerFee > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Broker Fee</span>
                  <span>${listing.brokerFee}</span>
                </div>
              )}
              {listing.applicationFee > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Application Fee</span>
                  <span>${listing.applicationFee}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Upfront</span>
                <span className="text-success">${totalUpfront.toLocaleString()}</span>
              </div>
              <small className="text-muted d-block mt-1">First month + deposit + fees</small>

              <hr />

              {/* Action Buttons */}
              {!isOwner && listing.status === 'available' && (
                <>
                  {hasApplied ? (
                    <button className="btn btn-secondary w-100 mb-2" disabled>
                      <i className="fa-solid fa-check me-2"></i>Application Submitted
                    </button>
                  ) : (
                    <button className="btn btn-maroon w-100 mb-2" onClick={() => navigate(`/listings/${listing.id}/apply`)}>
                      <i className="fa-solid fa-paper-plane me-2"></i>Apply Now
                    </button>
                  )}
                  <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/messages')}>
                    <i className="fa-solid fa-message me-2"></i>Contact Lister
                  </button>
                </>
              )}
              {isOwner && (
                <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate(`/listings/edit/${listing.id}`)}>
                  <i className="fa-solid fa-pen me-2"></i>Edit Listing
                </button>
              )}
            </div>
          </div>

          {/* Owner Card */} 
          {owner && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center">
                <img src={owner.profileImage} alt="" className="rounded-circle mb-2" width="64" height="64" />
                <h6 className="fw-bold mb-0">{owner.firstName} {owner.lastName}</h6>
                <small className="text-muted">{owner.year} &bull; {owner.major}</small>
                <div className="text-warning mt-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-${i < Math.round(owner.avgRating || 0) ? 'solid' : 'regular'} fa-star`}></i>
                  ))}
                  <small className="text-muted ms-1">({owner.numRatings})</small>
                </div>
                {owner.verified && (
                  <div className="mt-2">
                    <span className="badge bg-primary"><i className="fa-solid fa-check me-1"></i>BC Verified</span>
                  </div>
                )}
                <p className="text-muted small mt-2 mb-0">{owner.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
