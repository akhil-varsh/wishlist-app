import React, { useState } from 'react';

const CreateWishlistForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Wishlist name is required');
      return;
    }
    
    onSubmit({ name, description });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">Create New Wishlist</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="wishlistName" className="form-label">
              Wishlist Name *
            </label>
            <input
              type="text"
              className="form-control"
              id="wishlistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="wishlistDescription" className="form-label">
              Description (Optional)
            </label>
            <textarea
              className="form-control"
              id="wishlistDescription"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Wishlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWishlistForm;
