import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo: log in as Maria (user 3) for any input
    login(3);
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    login(3);
    navigate('/dashboard');
  };

  return (
    <div className="landing-page min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #8b1a2b 0%, #5a1018 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none">
                <div className="brand-icon-lg mx-auto mb-3">
                  <i className="fa-solid fa-house-chimney"></i>
                </div>
                <h3 className="text-white fw-bold">Hatchery</h3>
              </Link>
              <p className="text-white-50">Sign in to your BC Housing account</p>
            </div>

            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                {/* Google OAuth Button */}
                <button
                  className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-3"
                  onClick={handleGoogleLogin}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google (@bc.edu)
                </button>

                <div className="text-center text-muted my-3">
                  <span className="px-2 bg-white position-relative" style={{ zIndex: 1 }}>or</span>
                  <hr className="mt-0" style={{ marginTop: '-0.7rem' }} />
                </div>

                {/* Email Login */}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">BC Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="your.name@bc.edu"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" />
                      <label className="form-check-label small" htmlFor="remember">Remember me</label>
                    </div>
                    <a href="#" className="small text-decoration-none">Forgot password?</a>
                  </div>

                  <button type="submit" className="btn btn-maroon w-100 py-2 fw-semibold">
                    Sign In
                  </button>
                </form>

                <p className="text-center text-muted small mt-3 mb-0">
                  Don&apos;t have an account? <Link to="/signup" className="text-decoration-none fw-semibold">Sign up</Link>
                </p>
              </div>
            </div>

            <p className="text-center text-white-50 small mt-3">
              <i className="fa-solid fa-shield-halved me-1"></i>
              Only @bc.edu emails can access the platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
