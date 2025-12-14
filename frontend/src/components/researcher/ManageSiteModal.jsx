import React, { useState, useEffect } from 'react';
import './researcher.css';
import { addSite, updateSite } from './researcherService';
import { useLanguage } from '../../context/LanguageContext';

export default function ManageSiteModal({ site, researcherId, onClose, onSaved }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    site_name: '',
    location: '',
    description: '',
    price: '',
    image: '',
    category: 'Historical Site',
    region: '',
    visit_duration: '',
    nearby_attractions: '',
    map_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (site) {
      setFormData({
        site_name: site.site_name || '',
        location: site.location || site.location_address || '',
        description: site.description || site.full_description || site.short_description || '',
        price: site.price || site.visit_price || '',
        image: site.image || site.image_url || '',
        category: site.category || 'Historical Site',
        region: site.region || '',
        visit_duration: site.visit_duration || site.estimated_duration || '',
        nearby_attractions: site.nearby_attractions || '',
        map_url: site.map_url || ''
      });
    }
  }, [site]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate price
    if (formData.price && parseFloat(formData.price) < 1) {
      alert(t('msg_price_minimum') || 'Price must be at least 1 ETB');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        researcher_id: researcherId,
        is_approved: false
      };

      if (site) {
        await updateSite({ ...payload, site_id: site.site_id });
      } else {
        await addSite(payload);
      }
      onSaved();
    } catch (err) {
      alert(t('msg_save_error') + ': ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="admin-modal-header">
          <h3>{site ? t('modal_edit_site') : t('btn_add_new_site')}</h3>
          <button className="btn-ghost" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div className="admin-modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label>{t('lbl_site_name')}</label>
                <input name="site_name" value={formData.site_name} onChange={handleChange} required />
              </div>
              <div>
                <label>{t('lbl_category')}</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Historical Site">{t('cat_historical')}</option>
                  <option value="Cultural Site">{t('cat_cultural')}</option>
                  <option value="Natural Attraction">{t('cat_natural')}</option>
                </select>
              </div>
              <div>
                <label>{t('lbl_region')}</label>
                <input name="region" value={formData.region} onChange={handleChange} required />
              </div>
              <div>
                <label>{t('lbl_location')}</label>
                <input name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div>
                <label>{t('lbl_price')}</label>
                <input name="price" type="number" min="100" step="1" value={formData.price} onChange={handleChange} placeholder="Minimum 100 ETB" required/>
              </div>
              <div>
                <label>{t('lbl_visit_duration')}</label>
                <input name="visit_duration" value={formData.visit_duration} onChange={handleChange} placeholder={t('ph_duration')} />
              </div>
            </div>

            <label>{t('lbl_description')}</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={6} required />

            <label>{t('lbl_nearby')}</label>
            <input name="nearby_attractions" value={formData.nearby_attractions} onChange={handleChange} placeholder={t('ph_comma_sep')} />

            <label>{t('lbl_site_image')}</label>
            <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '8px', textAlign: 'center', background: '#f9f9f9' }}>
              {formData.image ? (
                <div style={{ position: 'relative' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                  >✕</button>
                </div>
              ) : (
                <div style={{ padding: '20px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>{t('lbl_upload_drag')}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, image: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <label style={{ marginTop: '15px', display: 'block' }}>{t('lbl_map_url')}</label>
            <input
              name="map_url"
              value={formData.map_url || ''}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
            />

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-outline" onClick={onClose}>{t('btn_cancel')}</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? t('btn_adding') : (site ? t('btn_submit_update') : t('btn_submit_approval'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
