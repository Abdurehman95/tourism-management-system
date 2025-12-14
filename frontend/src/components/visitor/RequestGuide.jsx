import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VisitorSidebar from './VisitorSidebar';
import './visitor.css';
import { visitorService } from '../../services/visitorService';
import ThemeToggle from '../common/ThemeToggle';
import PhoneInput from '../common/PhoneInput';

export default function RequestGuide() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    date: '',
    time: '',
    visitors: 1,
    specialReq: ''
  });

  useEffect(() => {
    visitorService.getSiteById(siteId).then(setSite);
    // Pre-fill user info if available
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.first_name} ${user.last_name}`,
        contact: user.email
      }));
    }
  }, [siteId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    const requestData = {
      visitor_id: user.user_id,
      visitor_name: formData.fullName,
      visitor_contact: formData.contact,
      site_id: parseInt(siteId),
      site_name: site ? site.site_name : 'Unknown Site',
      preferred_date: formData.date,
      preferred_time: formData.time,
      number_of_visitors: formData.visitors,
      special_requirements: formData.specialReq,
      // Use visit_price if available, otherwise price
      amount: site ? ((site.visit_price || site.price || 0) + (site.guide_fee || 0)) * formData.visitors : 0,
      // Default guide type for now, or add a selector if needed
      guide_type_id: 1
    };

    visitorService.createRequest(requestData).then(() => {
      alert('Request submitted successfully! Please proceed to payment.');
      navigate('/visitor/payments');
    });
  };

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Request a Site Agent</h1>
          <ThemeToggle />
        </header>

        <div className="card p-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Information (Phone/Email)</label>
              <PhoneInput
                value={formData.contact}
                onChange={(value) => setFormData({ ...formData, contact: value })}
                placeholder="Phone Number"
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Preferred Date</label>
                <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Preferred Time</label>
                <input type="time" className="form-control" name="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Number of Visitors</label>
              <input type="number" className="form-control" name="visitors" min="1" value={formData.visitors} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Special Requirements (Optional)</label>
              <textarea className="form-control" name="specialReq" rows="3" value={formData.specialReq} onChange={handleChange}></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
