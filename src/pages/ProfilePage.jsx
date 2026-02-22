import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { currentUser, reviews, listings, getUserById } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...currentUser });

  const userReviews = reviews.filter(r => r.reviewedUserId === currentUser?.id);
  const userListings = listings.filter(l => l.ownerId === currentUser?.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would update the user in context/backend
  };

  if (!currentUser) return null;

  return (
    <div className="row g-4">
      {/* Profile Card */}
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <img
              src={currentUser.profileImage}
              alt={currentUser.firstName}
              className="rounded-circle mb-3 border border-3"
              width="100"
              height="100"
            />
            <h5 className="fw-bold mb-0">{currentUser.firstName} {currentUser.lastName}</h5>
            <p className="text-muted small">{currentUser.email}</p>

            {currentUser.verified && (
              <span className="badge bg-primary mb-2">
                <i className="fa-solid fa-shield-check me-1"></i>BC Verified
              </span>
            )}

            <div className="text-warning my-2">
              {currentUser.avgRating ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-${i < Math.round(currentUser.avgRating) ? 'solid' : 'regular'} fa-star`}></i>
                  ))}
                  <span className="text-dark ms-1 small">({currentUser.numRatings} reviews)</span>
                </>
              ) : (
                <small className="text-muted">No ratings yet</small>
              )}
            </div>

            <hr />

            <div className="text-start">
              <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">Role</small>
                <small className="fw-semibold text-capitalize">{currentUser.role}</small>
              </div>
              {currentUser.year && (
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Year</small>
                  <small className="fw-semibold">{currentUser.year}</small>
                </div>
              )}
              {currentUser.major && (
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Major</small>
                  <small className="fw-semibold">{currentUser.major}</small>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">Phone</small>
                <small className="fw-semibold">{currentUser.phone}</small>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">Joined</small>
                <small className="fw-semibold">{new Date(currentUser.joinedDate).toLocaleDateString()}</small>
              </div>
              <div className="d-flex justify-content-between">
                <small className="text-muted">Listings</small>
                <small className="fw-semibold">{userListings.length}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form & Reviews */}
      <div className="col-lg-8">
        {/* Edit Profile */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Profile Information</h5>
            <button
              className={`btn btn-sm ${isEditing ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <><i className="fa-solid fa-check me-1"></i>Save</>
              ) : (
                <><i className="fa-solid fa-pen me-1"></i>Edit</>
              )}
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Email</label>
                <input type="email" className="form-control" value={currentUser.email} disabled />
                <div className="form-text">Email cannot be changed</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Year</label>
                <select
                  className="form-select"
                  name="year"
                  value={form.year || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select</option>
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                  <option>Graduate</option>
                  <option>Alumni</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Major</label>
                <input
                  type="text"
                  className="form-control"
                  name="major"
                  value={form.major || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Bio</label>
                <textarea
                  className="form-control"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">Reviews ({userReviews.length})</h5>
          </div>
          <div className="card-body">
            {userReviews.length === 0 ? (
              <div className="text-center text-muted py-3">
                <i className="fa-regular fa-star fs-1 mb-2 d-block"></i>
                <p>No reviews yet</p>
              </div>
            ) : (
              userReviews.map(review => {
                const reviewer = review.reviewerId ? getUserById(review.reviewerId) : null;
                return (
                  <div key={review.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <div className="text-warning">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa-${i < review.rating ? 'solid' : 'regular'} fa-star`}></i>
                      ))}
                    </div>
                    <div>
                      <p className="mb-1">{review.comment}</p>
                      <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
