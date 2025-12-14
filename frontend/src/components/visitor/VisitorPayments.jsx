import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import './visitor.css';
import { visitorService } from '../../services/visitorService';
import { paymentService } from '../../services/paymentService';
import ThemeToggle from '../common/ThemeToggle';

export default function VisitorPayments() {
  const [activeTab, setActiveTab] = useState('pending'); // pending, history
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('chapa');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
    const [chapaLoading, setChapaLoading] = useState(false);
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptPayment, setReceiptPayment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (!user) return;

    visitorService.getMyRequests(user.user_id).then(requests => {
        if (!Array.isArray(requests)) {
            console.error("VisitorPayments: requests is not array", requests);
            return;
        }
        // Filter requests that are pending payment (or just created and not paid)
        // For simplicity, let's say all requests need payment unless they have a confirmed payment
        visitorService.getMyPayments(user.user_id).then(payments => {
            const safePayments = Array.isArray(payments) ? payments : [];
            const paidRequestIds = safePayments.map(p => p.request_id);
            
            const pending = requests.filter(r => !paidRequestIds.includes(r.request_id));
            setPendingRequests(pending);

            setPaymentHistory(safePayments);
        }).catch(err => {
            console.error("VisitorPayments error fetching payments:", err);
            setPendingRequests(requests); // Assume all pending if payments fail?
            setPaymentHistory([]);
        });
    }).catch(err => console.error("VisitorPayments error fetching requests:", err));
  };

  const handlePayClick = (request) => {
    setSelectedRequest(request);
    setSelectedPaymentMethod('chapa'); // Default to Chapa so online flow is visible immediately
    setPaymentProofFile(null);
    setShowUploadModal(true);
  };

    const handleChapaCheckout = async () => {
        if (!selectedRequest) return;
        const user = JSON.parse(localStorage.getItem('visitor_user'));
        if (!user) {
            alert('Please login first');
            return;
        }

        setChapaLoading(true);
        try {
            const amount = selectedRequest.amount || selectedRequest.price || selectedRequest.total || 0;
            if (!amount || Number(amount) <= 0) {
                alert('Unable to start Chapa: amount is missing. Please ensure the request has a price.');
                return;
            }
            const payload = {
                request_id: selectedRequest.request_id,
                amount,
                currency: 'ETB',
                email: user.email || 'guest@example.com',
                first_name: user.first_name || 'Visitor',
                last_name: user.last_name || 'User',
                // Unique reference per payment
                tx_ref: `tourism_${selectedRequest.request_id}_${Date.now()}`,
                return_url: `${window.location.origin}/visitor/payments`,
                callback_url: `${window.location.origin}/api/payments/chapa/callback`,
                meta: {
                    request_id: selectedRequest.request_id,
                    visitor_id: user.user_id,
                    site: selectedRequest.site_name
                }
            };

            const res = await paymentService.createChapaPayment(payload);
            if (res?.checkout_url) {
                window.location.href = res.checkout_url;
            } else if (res?.message === 'Chapa initialization stub') {
                 // Handle stub mode for testing without real Chapa keys
                 alert('Chapa Stub: Payment simulated. Check console/network.');
                 // In a real app, we'd redirect to the stub URL or handle success
                 // For now, let's just reload to show it might be pending
                 window.location.reload();
            } else {
                alert('Could not start Chapa payment. Please try again or use another method.');
            }
        } catch (err) {
            alert(err.message || 'Chapa init failed');
        } finally {
            setChapaLoading(false);
        }
    };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    
    let proofUrl = 'https://via.placeholder.com/150';
    if (paymentProofFile) {
      proofUrl = URL.createObjectURL(paymentProofFile);
    }

    const formData = new FormData();
    formData.append('payment_id', selectedRequest.payment_id || 0); // We need a payment ID first? Or create one?
    // Actually, for manual upload, we might need to create the payment record first or send request_id
    // The backend uploadProof expects payment_id.
    // Let's assume we need to create a pending payment first if it doesn't exist.
    // But for now, let's send request_id and let backend handle or assume payment_id is known if we listed it.
    
    // Wait, if it's a pending request, it might not have a payment record yet.
    // We should probably create the payment record with status 'waiting' when uploading proof.
    // But the backend uploadProof takes payment_id.
    
    // Let's adjust to use a new endpoint or modify logic.
    // For now, let's assume the user creates a payment record via 'createChapa' (which is generic create) 
    // or we add a 'createManualPayment' endpoint.
    
    // Simpler: Just use the visitorService.submitPayment which mocks it currently?
    // No, we want real DB.
    
    // Let's use a direct fetch to upload proof.
    // But first we need a payment_id.
    // If the request is pending, maybe we create a payment record on the fly?
    
    // Let's change the flow:
    // 1. Create Payment Record (Manual)
    // 2. Upload Proof linked to that Payment ID
    
    // For this iteration, let's just alert that manual upload needs backend support for creation.
    // Or better, let's implement it properly.
    
    alert('Please use Chapa for now. Manual upload requires backend update.');
    return;

    /*
    visitorService.submitPayment(paymentData).then(() => {
        alert('Payment proof uploaded successfully! Admin will verify.');
        setShowUploadModal(false);
        loadData(); // Refresh lists
    });
    */
  };

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Payments</h1>
          <ThemeToggle />
        </header>

        <div className="card p-3">
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending Payments</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Payment History</button>
                </li>
            </ul>

            {activeTab === 'pending' && (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Site</th>
                                <th>Amount (ETB)</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map(p => (
                                <tr key={p.request_id}>
                                    <td>#{p.request_id}</td>
                                    <td>{p.site_name}</td>
                                    <td>{p.amount || 'N/A'}</td>
                                    <td>{p.preferred_date}</td>
                                    <td><span className="badge bg-warning text-dark">{p.request_status}</span></td>
                                    <td>
                                        <button className="btn btn-sm btn-success" onClick={() => handlePayClick(p)}>Pay Now</button>
                                    </td>
                                </tr>
                            ))}
                            {pendingRequests.length === 0 && <tr><td colSpan="6" className="text-center">No pending payments.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Site</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map(p => (
                                <tr key={p.payment_id}>
                                    <td>#{p.payment_id}</td>
                                    <td>{p.site}</td>
                                    <td>{p.amount}</td>
                                    <td>{p.date}</td>
                                    <td>{p.method}</td>
                                    <td><span className={`badge ${p.payment_status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>{p.payment_status}</span></td>
                                    <td>
                                        <button 
                                          className="btn btn-sm btn-outline-primary" 
                                          onClick={() => { setReceiptPayment(p); setShowReceiptModal(true); }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paymentHistory.length === 0 && <tr><td colSpan="7" className="text-center">No payment history.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Payment Modal */}
        {showUploadModal && (
            <div className="admin-modal-backdrop">
                <div className="admin-modal" style={{maxWidth: '600px'}}>
                    <div className="admin-modal-header">
                        <h3>Make Payment for Request #{selectedRequest?.request_id}</h3>
                        <button className="btn-ghost text-dark" onClick={() => setShowUploadModal(false)}>✕</button>
                    </div>
                    <div className="admin-modal-body">
                        <div className="my-4 d-flex flex-column gap-4">
                            <div className="p-4 bg-light rounded-3 border">
                                <div className="row g-3">
                                    <div className="col-6">
                                        <small className="text-muted d-block mb-1">Payer</small>
                                        <div className="fw-bold text-dark">{(JSON.parse(localStorage.getItem('visitor_user'))?.first_name || 'Visitor') + ' ' + (JSON.parse(localStorage.getItem('visitor_user'))?.last_name || '')}</div>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block mb-1">Email</small>
                                        <div className="fw-bold text-dark text-truncate">{JSON.parse(localStorage.getItem('visitor_user'))?.email || 'guest@example.com'}</div>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block mb-1">Site</small>
                                        <div className="fw-bold text-dark">{selectedRequest?.site_name || '—'}</div>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block mb-1">Amount</small>
                                        <div className="fw-bold text-primary fs-5">{(selectedRequest?.amount || selectedRequest?.price || selectedRequest?.total || 0)} ETB</div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button 
                                    className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm" 
                                    type="button"
                                    disabled={chapaLoading}
                                    onClick={handleChapaCheckout}
                                    style={{minWidth: '200px', fontWeight: '600'}}
                                >
                                    {chapaLoading ? (
                                        <span><span className="spinner-border spinner-border-sm me-2"></span>Processing...</span>
                                    ) : (
                                        'Pay with Chapa'
                                    )}
                                </button>
                                <div className="mt-3 text-muted small">
                                    <span className="me-2">Secured by Chapa. Supports:</span>
                                    <span className="badge bg-light text-dark border me-1">Telebirr</span>
                                    <span className="badge bg-light text-dark border">CBE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Receipt Modal - stays until user closes */}
        {showReceiptModal && receiptPayment && (
            <div className="admin-modal-backdrop" style={{zIndex: 10000}}>
                <div className="admin-modal" style={{maxWidth: '520px'}}>
                    <div className="admin-modal-header">
                        <h3>Payment Receipt #{receiptPayment.payment_id}</h3>
                        <button className="btn-ghost text-dark" onClick={() => { setShowReceiptModal(false); setReceiptPayment(null); }}>✕</button>
                    </div>
                    <div className="admin-modal-body">
                        <div className="mb-3"><strong>Site:</strong> {receiptPayment.site}</div>
                        <div className="mb-3"><strong>Amount:</strong> {receiptPayment.amount} ETB</div>
                        <div className="mb-3"><strong>Method:</strong> {receiptPayment.method}</div>
                        <div className="mb-3"><strong>Status:</strong> {receiptPayment.payment_status}</div>
                        <div className="mb-3"><strong>Date:</strong> {receiptPayment.date || new Date(receiptPayment.created_at).toLocaleString()}</div>
                        {receiptPayment.tx_ref && <div className="mb-3"><strong>Tx Ref:</strong> {receiptPayment.tx_ref}</div>}
                        {receiptPayment.proof_url && (
                            <div className="mb-3">
                                <strong>Proof:</strong><br/>
                                <a href={receiptPayment.proof_url} target="_blank" rel="noreferrer">Open proof</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
