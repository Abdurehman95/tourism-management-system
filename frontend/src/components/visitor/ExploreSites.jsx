import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import './visitor.css';
import { Link } from 'react-router-dom';
import { visitorService } from '../../services/visitorService';
import ThemeToggle from '../common/ThemeToggle';

export default function ExploreSites() {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitorService.getSites().then(data => {
      // Map data to match component expectation if needed, or adjust component
      setSites(data.map(s => ({
        id: s.site_id,
        name: s.site_name,
        image: s.image_url || s.image || 'https://via.placeholder.com/300',
        location: s.location_address || s.location || 'Unknown',
        description: s.short_description || s.description || '',
        price: s.visit_price || s.price || 0
      })));
      setLoading(false);
    });
  }, []);

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
            <h1>Explore Historical Sites</h1>
            <input
              type="text"
              placeholder="Search sites..."
              className="form-control w-25"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
          <ThemeToggle />
        </header>

        {loading ? <LoadingSpinner /> : (
          <div className="visitor-cards">
            {filteredSites.map(site => (
              <div className="site-card-new" key={site.id}>
                <div className="site-image-container">
                  <img src={site.image} alt={site.name} />
                </div>
                <div className="site-content">
                  <h3 className="site-title">{site.name}</h3>
                  <p className="site-location">{site.location}</p>
                  <p className="site-description">{site.description}</p>

                  <div className="site-footer">
                    <div className="price-row">
                      <div className="price-tag">
                        <span className="price-amount">{site.price}</span>
                        <span className="price-currency">ETB</span>
                      </div>
                      <Link to={`/visitor/sites/${site.id}`} className="view-details-link">View Details</Link>
                    </div>
                    <Link to={`/visitor/request-guide/${site.id}`} className="request-btn">Request Site Agent</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
