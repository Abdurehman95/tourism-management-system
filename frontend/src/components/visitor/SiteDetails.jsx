import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VisitorSidebar from './VisitorSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import './visitor.css';
import { visitorService } from '../../services/visitorService';
import ThemeToggle from '../common/ThemeToggle';

export default function SiteDetails() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    visitorService.getSiteById(id).then(s => {
      if (s) {
        const mappedSite = {
          id: s.site_id,
          name: s.site_name,
          images: s.image ? [s.image] : ['https://via.placeholder.com/800x400'],
          location: s.location || 'Unknown',
          description: s.description || 'No description available.',
          attractions: [], // Add to dataService if needed
          price: s.price || 0,
          guideFee: s.guide_fee || 0,
          duration: '3-4 hours',
          reviews: []
        };
        setSite(mappedSite);
        setActiveImage(mappedSite.images[0]);
      }
    });
  }, [id]);

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <ThemeToggle />
        </div>
        {!site ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Link to="/visitor/sites" className="btn btn-outline-secondary">← Back to Sites</Link>
              <Link to={`/visitor/request-guide/${site.id}`} className="btn btn-primary">Request Site Agent for this Site</Link>
            </div>

            <div className="card p-3">
              <div className="row">
                <div className="col-md-6">
                  <img src={activeImage} alt={site.name} className="img-fluid rounded mb-2" style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }} />
                  <div className="d-flex gap-2 overflow-auto">
                    {site.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="thumbnail"
                        style={{ width: '80px', height: '60px', objectFit: 'cover', cursor: 'pointer', border: activeImage === img ? '2px solid blue' : 'none' }}
                        onClick={() => setActiveImage(img)}
                      />
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <h2>{site.name}</h2>
                  <p className="text-muted"><i className="fa-solid fa-location-dot"></i> {site.location}</p>
                  <h4 className="text-primary">{site.price} ETB <small className="text-muted fs-6">+ {site.guideFee} ETB Site Agent Fee</small></h4>

                  <div className="mt-3">
                    <h5>Description</h5>
                    <p>{site.description}</p>
                  </div>

                  <div className="mt-3">
                    <h5>Key Attractions</h5>
                    <ul>
                      {site.attractions.length > 0 ? site.attractions.map((attr, idx) => <li key={idx}>{attr}</li>) : <li>Main Site Area</li>}
                    </ul>
                  </div>

                  <div className="mt-3">
                    <p><strong>Estimated Duration:</strong> {site.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-4 p-3">
              <h3>Reviews</h3>
              {site.reviews.length > 0 ? site.reviews.map((review, idx) => (
                <div key={idx} className="border-bottom py-2">
                  <div className="d-flex justify-content-between">
                    <strong>{review.user}</strong>
                    <span className="text-warning">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </div>
              )) : <p className="text-muted">No reviews yet.</p>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
