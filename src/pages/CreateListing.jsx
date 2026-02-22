import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CreateListing() {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit mode
  const { listings, addListing, updateListing } = useApp();
  const isEdit = Boolean(id);
  const existingListing = isEdit ? listings.find(l => l.id === Number(id)) : null;

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: 'Brighton',
    state: 'MA',
    zip: '02135',
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    sqft: '',
    monthlyRent: '',
    utilitiesIncluded: false,
    estimatedUtilities: '',
    securityDeposit: '',
    brokerFee: 0,
    applicationFee: 0,
    leaseType: 'Sublease',
    availableFrom: '',
    availableTo: '',
    landlordApprovalRequired: false,
    parking: false,
    shared: false,
    petsAllowed: false,
    hasStairs: false,
    floor: 1,
    furnished: false,
    laundry: 'In-Building',
    amenities: [],
    rules: [],
    requirements: [],
    images: [],
  });

  const [step, setStep] = useState(1);
  const [newAmenity, setNewAmenity] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newReq, setNewReq] = useState('');

  useEffect(() => {
    if (existingListing) {
      setForm({
        ...existingListing,
        images: existingListing.images || [],
        amenities: existingListing.amenities || [],
        rules: existingListing.rules || [],
        requirements: existingListing.requirements || [],
      });
    }
  }, [existingListing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const addToList = (field, value, setter) => {
    if (value.trim()) {
      setForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter('');
    }
  };

  const removeFromList = (field, index) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateListing(Number(id), form);
    } else {
      addListing({
        ...form,
        lat: 42.338 + (Math.random() - 0.5) * 0.02,
        lng: -71.153 + (Math.random() - 0.5) * 0.02,
        images: form.images.length > 0 ? form.images : [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        ],
      });
    }
    navigate('/my-listings');
  };

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-1">{isEdit ? 'Edit Listing' : 'Create a New Listing'}</h4>
              <p className="text-muted mb-4">{isEdit ? 'Update your listing details.' : 'Fill in the details to list your place for subletting.'}</p>

              {/* Step indicators */}
              <div className="d-flex justify-content-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className="d-flex align-items-center">
                      <div
                        className={`step-dot ${step >= s ? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setStep(s)}
                      >
                        {s}
                      </div>
                      {s < 4 && <div className={`step-line ${step > s ? 'active' : ''}`}></div>}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <h5 className="fw-bold mb-3">Basic Information</h5>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Listing Title</label>
                      <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Sunny 2BR on Comm Ave" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your place..." required />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Address</label>
                        <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} required />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label fw-semibold">City</label>
                        <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label fw-semibold">State</label>
                        <input type="text" className="form-control" name="state" value={form.state} onChange={handleChange} />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label fw-semibold">ZIP</label>
                        <input type="text" className="form-control" name="zip" value={form.zip} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Property Type</label>
                        <select className="form-select" name="propertyType" value={form.propertyType} onChange={handleChange}>
                          <option>Apartment</option>
                          <option>House</option>
                          <option>Studio</option>
                          <option>Room</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Bedrooms</label>
                        <select className="form-select" name="bedrooms" value={form.bedrooms} onChange={handleChange}>
                          <option value={0}>Studio</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4+</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Bathrooms</label>
                        <select className="form-select" name="bathrooms" value={form.bathrooms} onChange={handleChange}>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3+</option>
                        </select>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Square Feet</label>
                        <input type="number" className="form-control" name="sqft" value={form.sqft} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Floor</label>
                        <input type="number" className="form-control" name="floor" value={form.floor} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Laundry</label>
                        <select className="form-select" name="laundry" value={form.laundry} onChange={handleChange}>
                          <option>In-Unit</option>
                          <option>In-Building</option>
                          <option>None</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Pricing & Dates */}
                {step === 2 && (
                  <>
                    <h5 className="fw-bold mb-3">Pricing & Availability</h5>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Monthly Rent ($)</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input type="number" className="form-control" name="monthlyRent" value={form.monthlyRent} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Security Deposit ($)</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input type="number" className="form-control" name="securityDeposit" value={form.securityDeposit} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <div className="form-check mb-2">
                          <input className="form-check-input" type="checkbox" name="utilitiesIncluded" checked={form.utilitiesIncluded} onChange={handleChange} id="utilIncl" />
                          <label className="form-check-label fw-semibold" htmlFor="utilIncl">Utilities Included</label>
                        </div>
                      </div>
                      {!form.utilitiesIncluded && (
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Est. Utilities ($/mo)</label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" name="estimatedUtilities" value={form.estimatedUtilities} onChange={handleChange} />
                          </div>
                        </div>
                      )}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Application Fee ($)</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input type="number" className="form-control" name="applicationFee" value={form.applicationFee} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Lease Type</label>
                        <select className="form-select" name="leaseType" value={form.leaseType} onChange={handleChange}>
                          <option>Sublease</option>
                          <option>Short-term</option>
                          <option>Full Lease</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Available From</label>
                        <input type="date" className="form-control" name="availableFrom" value={form.availableFrom} onChange={handleChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Available To</label>
                        <input type="date" className="form-control" name="availableTo" value={form.availableTo} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="landlordApprovalRequired" checked={form.landlordApprovalRequired} onChange={handleChange} id="landlord" />
                      <label className="form-check-label" htmlFor="landlord">Landlord approval required for subletting</label>
                    </div>
                  </>
                )}

                {/* Step 3: Features & Rules */}
                {step === 3 && (
                  <>
                    <h5 className="fw-bold mb-3">Features & Rules</h5>
                    <div className="row g-3 mb-3">
                      <div className="col-md-3 col-6">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="furnished" checked={form.furnished} onChange={handleChange} id="furnished" />
                          <label className="form-check-label" htmlFor="furnished">Furnished</label>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="parking" checked={form.parking} onChange={handleChange} id="parking" />
                          <label className="form-check-label" htmlFor="parking">Parking</label>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="petsAllowed" checked={form.petsAllowed} onChange={handleChange} id="pets" />
                          <label className="form-check-label" htmlFor="pets">Pets Allowed</label>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="shared" checked={form.shared} onChange={handleChange} id="shared" />
                          <label className="form-check-label" htmlFor="shared">Shared Space</label>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Amenities</label>
                      <div className="input-group input-group-sm mb-2">
                        <input type="text" className="form-control" value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="e.g. Central AC" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('amenities', newAmenity, setNewAmenity))} />
                        <button type="button" className="btn btn-outline-primary" onClick={() => addToList('amenities', newAmenity, setNewAmenity)}>Add</button>
                      </div>
                      <div className="d-flex gap-1 flex-wrap">
                        {form.amenities.map((a, i) => (
                          <span key={i} className="badge bg-primary d-flex align-items-center gap-1 py-2">
                            {a}
                            <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }} onClick={() => removeFromList('amenities', i)}></i>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">House Rules</label>
                      <div className="input-group input-group-sm mb-2">
                        <input type="text" className="form-control" value={newRule} onChange={e => setNewRule(e.target.value)} placeholder="e.g. No Smoking" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('rules', newRule, setNewRule))} />
                        <button type="button" className="btn btn-outline-warning" onClick={() => addToList('rules', newRule, setNewRule)}>Add</button>
                      </div>
                      <div className="d-flex gap-1 flex-wrap">
                        {form.rules.map((r, i) => (
                          <span key={i} className="badge bg-warning text-dark d-flex align-items-center gap-1 py-2">
                            {r}
                            <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }} onClick={() => removeFromList('rules', i)}></i>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tenant Requirements</label>
                      <div className="input-group input-group-sm mb-2">
                        <input type="text" className="form-control" value={newReq} onChange={e => setNewReq(e.target.value)} placeholder="e.g. BC Student" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('requirements', newReq, setNewReq))} />
                        <button type="button" className="btn btn-outline-info" onClick={() => addToList('requirements', newReq, setNewReq)}>Add</button>
                      </div>
                      <div className="d-flex gap-1 flex-wrap">
                        {form.requirements.map((r, i) => (
                          <span key={i} className="badge bg-info d-flex align-items-center gap-1 py-2">
                            {r}
                            <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }} onClick={() => removeFromList('requirements', i)}></i>
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Images & Preview */}
                {step === 4 && (
                  <>
                    <h5 className="fw-bold mb-3">Images & Review</h5>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Upload Photos</label>
                      <div className="border border-2 border-dashed rounded p-4 text-center bg-light">
                        <i className="fa-solid fa-cloud-arrow-up fs-1 text-muted mb-2 d-block"></i>
                        <p className="text-muted mb-1">Drag & drop images here, or click to browse</p>
                        <small className="text-muted">JPG, PNG up to 5MB each (max 10 images)</small>
                        <div className="mt-2">
                          <button type="button" className="btn btn-outline-primary btn-sm">
                            <i className="fa-solid fa-image me-1"></i>Choose Files
                          </button>
                        </div>
                      </div>
                      <small className="text-muted mt-1 d-block">(Demo: placeholder images will be used)</small>
                    </div>

                    {/* Preview Summary */}
                    <h6 className="fw-bold mb-2">Listing Preview</h6>
                    <div className="card bg-light mb-3">
                      <div className="card-body small">
                        <div className="row g-2">
                          <div className="col-6"><strong>Title:</strong> {form.title || '—'}</div>
                          <div className="col-6"><strong>Type:</strong> {form.propertyType}</div>
                          <div className="col-6"><strong>Address:</strong> {form.address || '—'}, {form.city}</div>
                          <div className="col-6"><strong>Rent:</strong> ${form.monthlyRent || '—'}/mo</div>
                          <div className="col-6"><strong>Bedrooms:</strong> {form.bedrooms === 0 ? 'Studio' : form.bedrooms}</div>
                          <div className="col-6"><strong>Deposit:</strong> ${form.securityDeposit || '—'}</div>
                          <div className="col-6"><strong>Dates:</strong> {form.availableFrom || '—'} to {form.availableTo || '—'}</div>
                          <div className="col-6"><strong>Lease:</strong> {form.leaseType}</div>
                          {form.amenities.length > 0 && (
                            <div className="col-12"><strong>Amenities:</strong> {form.amenities.join(', ')}</div>
                          )}
                          {form.rules.length > 0 && (
                            <div className="col-12"><strong>Rules:</strong> {form.rules.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  {step > 1 ? (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(step - 1)}>
                      <i className="fa-solid fa-arrow-left me-1"></i> Back
                    </button>
                  ) : <div />}

                  {step < 4 ? (
                    <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
                      Next <i className="fa-solid fa-arrow-right ms-1"></i>
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-maroon fw-semibold px-4">
                      <i className="fa-solid fa-check me-1"></i> {isEdit ? 'Update Listing' : 'Publish Listing'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
