import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <nav className="navbar navbar-expand-lg navbar-dark position-absolute w-100 top-0" style={{ zIndex: 10 }}>
          <div className="container">
            <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
              <div className="brand-icon-lg">
                <i className="fa-solid fa-house-chimney"></i>
              </div>
              Perch
            </a>
            <div className="d-flex gap-2">
              {isAuthenticated ? (
                <button className="btn btn-light fw-semibold" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button className="btn btn-outline-light" onClick={() => navigate('/login')}>
                    Log In
                  </button>
                  <button className="btn btn-light fw-semibold" onClick={() => navigate('/signup')}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="hero-overlay">
          <div className="container text-center text-white">
            <h1 className="display-3 fw-bold mb-3">
              Find Your Perfect<br />
              <span className="text-warning">BC Sublet</span>
            </h1>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: 600 }}>
              A trusted platform exclusively for Boston College students to find and offer
              off-campus housing and summer sublets within a safe, verified community.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button className="btn btn-warning btn-lg fw-semibold px-4" onClick={() => navigate('/search')}>
                <i className="fa-solid fa-magnifying-glass me-2"></i>Browse Listings
              </button>
              <button className="btn btn-outline-light btn-lg px-4" onClick={() => navigate('/listings/create')}>
                <i className="fa-solid fa-plus me-2"></i>Post a Sublet
              </button>
            </div>

            {/* Quick stats */}
            <div className="row mt-5 g-4 justify-content-center">
              <div className="col-auto">
                <div className="text-center">
                  <h3 className="fw-bold mb-0">8+</h3>
                  <small className="text-white-50">Active Listings</small>
                </div>
              </div>
              <div className="col-auto px-4">
                <div className="text-center">
                  <h3 className="fw-bold mb-0">6</h3>
                  <small className="text-white-50">Verified Students</small>
                </div>
              </div>
              <div className="col-auto">
                <div className="text-center">
                  <h3 className="fw-bold mb-0">100%</h3>
                  <small className="text-white-50">BC Verified</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <h2 className="text-center fw-bold mb-2">Why Perch?</h2>
          <p className="text-center text-muted mb-5">Built by BC students, for BC students</p>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 text-center p-4 h-100 feature-card">
                <div className="feature-icon mx-auto mb-3">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h5 className="fw-bold">Trusted Network</h5>
                <p className="text-muted small">Only verified BC students can access the platform. Your sublet is always with someone from your community.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 text-center p-4 h-100 feature-card">
                <div className="feature-icon mx-auto mb-3">
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <h5 className="fw-bold">Interactive Map</h5>
                <p className="text-muted small">Browse listings on an interactive map. Filter by price, dates, amenities, and find the perfect spot near campus.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 text-center p-4 h-100 feature-card">
                <div className="feature-icon mx-auto mb-3">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
                <h5 className="fw-bold">Easy Agreements</h5>
                <p className="text-muted small">Automated sublet agreement generation. No hassle with paperwork or legal complexity.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 text-center p-4 h-100 feature-card">
                <div className="feature-icon mx-auto mb-3">
                  <i className="fa-solid fa-star"></i>
                </div>
                <h5 className="fw-bold">Ratings & Reviews</h5>
                <p className="text-muted small">Build trust through community reviews. Rate your experience and help others make informed decisions.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 text-center p-4 h-100 feature-card">
                <div className="feature-icon mx-auto mb-3">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <h5 className="fw-bold">Direct Messaging</h5>
                <p className="text-muted small">Communicate directly with listers through our built-in messaging system. No need to share personal info.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 text-center p-4 h-100 feature-card">
                <div className="feature-icon mx-auto mb-3">
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
                <h5 className="fw-bold">Cost Transparency</h5>
                <p className="text-muted small">See total upfront costs, utilities, deposits, and fees clearly displayed. No hidden surprises.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row g-4 align-items-start">
            <div className="col-md-3 text-center">
              <div className="step-number mx-auto">1</div>
              <h6 className="fw-bold mt-3">Verify with BC Email</h6>
              <p className="text-muted small">Sign up with your @bc.edu email to join the trusted community.</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-number mx-auto">2</div>
              <h6 className="fw-bold mt-3">Browse or Post</h6>
              <p className="text-muted small">Search available sublets on the map or create your own listing.</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-number mx-auto">3</div>
              <h6 className="fw-bold mt-3">Connect & Apply</h6>
              <p className="text-muted small">Message listers, submit applications, and find your match.</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-number mx-auto">4</div>
              <h6 className="fw-bold mt-3">Move In</h6>
              <p className="text-muted small">Sign your auto-generated agreement and enjoy your new place!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-maroon text-white">
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-3">Ready to find your summer sublet?</h2>
          <p className="mb-4 opacity-75">Join the BC housing community today.</p>
          <button className="btn btn-warning btn-lg fw-semibold px-5" onClick={() => navigate('/signup')}>
            Get Started <i className="fa-solid fa-arrow-right ms-2"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-house-chimney"></i>
                <span className="fw-bold">Perch</span>
                <span className="text-white-50">| BC Housing Platform</span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-white-50">&copy; 2026 Perch. Built for Boston College students.</small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
