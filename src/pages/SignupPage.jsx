import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    year: '',
    major: '',
    phone: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleGoogleSignup = () => {
    login(3);
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      login(3);
      navigate('/dashboard');
    }
  };

  return (
    <div className="landing-page min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #8b1a2b 0%, #5a1018 100%)' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none">
                <div className="brand-icon-lg mx-auto mb-3">
                  <i className="fa-solid fa-house-chimney"></i>
                </div>
                <h3 className="text-white fw-bold">Hatchery</h3>
              </Link>
              <p className="text-white-50">Create your BC Housing account</p>
            </div>

            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                {/* Progress indicator */}
                <div className="d-flex justify-content-center mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                  </div>
                </div>

                {/* Google signup */}
                {step === 1 && (
                  <>
                    <button
                      className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-3"
                      onClick={handleGoogleSignup}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign up with Google (@bc.edu)
                    </button>

                    <div className="text-center text-muted my-3">
                      <span className="px-2 bg-white position-relative" style={{ zIndex: 1 }}>or sign up with email</span>
                      <hr className="mt-0" style={{ marginTop: '-0.7rem' }} />
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <>
                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <label className="form-label small fw-semibold">First Name</label>
                          <input type="text" className="form-control" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Last Name</label>
                          <input type="text" className="form-control" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">BC Email</label>
                        <div className="input-group">
                          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="your.name@bc.edu" />
                          <span className="input-group-text">@bc.edu</span>
                        </div>
                        <div className="form-text">Must be a valid Boston College email address</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Password</label>
                        <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Confirm Password</label>
                        <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                      </div>

                      <button type="submit" className="btn btn-maroon w-100 py-2 fw-semibold">
                        Continue <i className="fa-solid fa-arrow-right ms-1"></i>
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h6 className="fw-bold mb-3">Complete Your Profile</h6>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Year</label>
                        <select className="form-select" name="year" value={form.year} onChange={handleChange}>
                          <option value="">Select your year</option>
                          <option>Freshman</option>
                          <option>Sophomore</option>
                          <option>Junior</option>
                          <option>Senior</option>
                          <option>Graduate</option>
                          <option>Alumni</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Major</label>
                        <input type="text" className="form-control" name="major" value={form.major} onChange={handleChange} placeholder="e.g. Computer Science" />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Phone Number</label>
                        <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="(617) 555-0000" />
                      </div>

                      <div className="mb-3">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} id="terms" />
                          <label className="form-check-label small" htmlFor="terms">
                            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                          </label>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary flex-fill" onClick={() => setStep(1)}>
                          <i className="fa-solid fa-arrow-left me-1"></i> Back
                        </button>
                        <button type="submit" className="btn btn-maroon flex-fill fw-semibold">
                          Create Account
                        </button>
                      </div>
                    </>
                  )}
                </form>

                {step === 1 && (
                  <p className="text-center text-muted small mt-3 mb-0">
                    Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Sign in</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
