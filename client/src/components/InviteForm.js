import React, { useState } from 'react';
import { BsEnvelopeFill, BsPeopleFill, BsXCircle, BsSend } from 'react-icons/bs';

const InviteForm = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      setError('Valid email is required');
      return;
    }
    
    onSubmit(email);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <BsPeopleFill className="me-2" />
          <h5 className="card-title mb-0">Invite Someone</h5>
        </div>
        <button 
          className="btn btn-sm btn-light text-primary" 
          onClick={onCancel}
          title="Close"
        >
          <BsXCircle />
        </button>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="inviteEmail" className="form-label d-flex align-items-center">
              <BsEnvelopeFill className="me-2" /> Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <BsEnvelopeFill />
              </span>
              <input
                type="email"
                className="form-control"
                id="inviteEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter their email address..."
                required
              />
            </div>
            <div className="form-text">
              We'll send them an invitation to join this wishlist.
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary me-2 d-flex align-items-center"
              onClick={onCancel}
            >
              <BsXCircle className="me-1" /> Cancel
            </button>
            <button type="submit" className="btn btn-primary d-flex align-items-center">
              <BsSend className="me-1" /> Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteForm;
