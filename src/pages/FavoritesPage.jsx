import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { myFavoriteListings } = useApp();

  return (
    <div>
      <h4 className="fw-bold mb-1">Saved Listings</h4>
      <p className="text-muted mb-4">Your favorited listings for quick access</p>

      {myFavoriteListings.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-regular fa-heart fs-1 text-muted mb-3 d-block"></i>
          <h5 className="text-muted">No saved listings</h5>
          <p className="text-muted">Click the heart icon on listings to save them here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse Listings</button>
        </div>
      ) : (
        <div className="row g-3">
          {myFavoriteListings.map(listing => (
            <div key={listing.id} className="col-md-6 col-lg-4">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
