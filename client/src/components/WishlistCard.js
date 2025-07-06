import React from 'react';
import { Link } from 'react-router-dom';

const WishlistCard = ({ wishlist, onDelete }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{wishlist.name}</h5>
        {wishlist.description && (
          <p className="card-text">{wishlist.description}</p>
        )}
        <p className="card-text text-muted small">
          Created: {new Date(wishlist.created_at).toLocaleDateString()}
        </p>
        <p className="card-text text-muted small">
          By: {wishlist.profiles?.full_name || wishlist.profiles?.email}
        </p>
      </div>
      <div className="card-footer bg-transparent border-top-0">
        <div className="d-flex justify-content-between">
          <Link to={`/wishlists/${wishlist.id}`} className="btn btn-primary">
            View Items
          </Link>
          <button
            className="btn btn-outline-danger"
            onClick={() => onDelete(wishlist.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
