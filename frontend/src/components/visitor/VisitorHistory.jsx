import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import './visitor.css';
import { visitorService } from '../../services/visitorService';
import ThemeToggle from '../common/ThemeToggle';

export default function VisitorHistory() {
  const [visits, setVisits] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const loadHistory = () => {
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (user) {
        visitorService.getHistory(user.user_id).then(data => {
            if (!Array.isArray(data)) {
                console.error("VisitorHistory: Expected array, got", data);
                setVisits([]);
                return;
            }
            const mappedVisits = data.map(r => ({
                id: r.request_id,
                site: r.site_name,
                date: r.preferred_date,
                guide: r.assigned_guide_id ? 'Assigned' : 'Pending',
                status: r.request_status === 'approved' ? 'Upcoming' : (r.request_status === 'completed' ? 'Completed' : r.request_status),
                rating: r.rating,
                feedback: r.feedback
            }));
            setVisits(mappedVisits);
        }).catch(err => {
            console.error("VisitorHistory error:", err);
            setVisits([]);
        });
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const openRating = (visit) => {
    setSelectedVisit(visit);
    setRating(5);
    setComment('');
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (selectedVisit) {
      await visitorService.submitFeedback(selectedVisit.id, rating, comment);
      setShowRatingModal(false);
      loadHistory();
    }
  };

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Visit History & Schedules</h1>
          <ThemeToggle />
        </header>

        <div className="card p-3">
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Site</th>
                            <th>Date</th>
                            <th>Site Agent</th>
                            <th>Status</th>
                            <th>Feedback/Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visits.map(visit => (
                            <tr key={visit.id}>
                                <td>{visit.site}</td>
                                <td>{visit.date}</td>
                                <td>{visit.guide}</td>
                                <td>
                                  <span className={`badge ${visit.status === 'Completed' ? 'bg-success' : (visit.status === 'Upcoming' ? 'bg-primary' : 'bg-secondary')}`}>
                                    {visit.status}
                                  </span>
                                </td>
                                <td>
                                  {visit.status === 'Completed' ? (
                                    visit.rating ? (
                                      <span>{'⭐'.repeat(visit.rating)}</span>
                                    ) : (
                                      <button className="btn btn-sm btn-outline-primary" onClick={() => openRating(visit)}>Rate Visit</button>
                                    )
                                  ) : (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                            </tr>
                        ))}
                        {visits.length === 0 && <tr><td colSpan="5" className="text-center">No visits found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>

        {showRatingModal && (
          <div className="visitor-modal-backdrop">
            <div className="visitor-modal">
              <h3>Rate your visit to {selectedVisit?.site}</h3>
              <div className="my-3">
                <label>Rating:</label>
                <div className="rating-stars">
                  {[1,2,3,4,5].map(star => (
                    <span 
                      key={star} 
                      style={{cursor:'pointer', fontSize:'24px', color: star <= rating ? '#ffc107' : '#e4e5e9'}}
                      onClick={() => setRating(star)}
                    >★</span>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label>Comment:</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={comment} 
                  onChange={e => setComment(e.target.value)}
                  placeholder="How was your experience?"
                ></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitRating}>Submit Feedback</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}