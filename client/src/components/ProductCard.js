import React, { useState } from 'react';
import { BsFillCartPlusFill, BsTrash, BsStar, BsStarFill, BsPerson, BsPencil, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import ProductLikes from './ProductLikes';
import ProductComments from './ProductComments';

const ProductCard = ({ 
  product, 
  onAddToWishlist, 
  showAddButton = true, 
  addedBy = null, 
  onRemove = null,
  onEdit = null,
  isManual = false,
  wishlistId = null
}) => {
  const [showSocial, setShowSocial] = useState(false);

  // Helper to render star rating
  const renderRating = (rating) => {
    const ratingValue = rating?.rate || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.round(ratingValue)) {
        stars.push(<BsStarFill key={i} className="text-warning" />);
      } else {
        stars.push(<BsStar key={i} className="text-warning" />);
      }
    }
    return (
      <div className="d-flex align-items-center mb-2">
        <div className="me-2">{stars}</div>
        <small className="text-muted">({rating?.count || 0})</small>
      </div>
    );
  };

  // Get product ID from either added product or manual product
  const productItemId = product.id;

  // Determine if social features should be shown (only in wishlist detail view)
  const canShowSocial = wishlistId && productItemId && !showAddButton;

  return (
    <div className="card h-100 shadow-sm">
      {/* Badge to show if product is manual */}
      {isManual && (
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-info">Custom</span>
        </div>
      )}

      {product.category || product.product_category ? (
        <div className="product-badge">
          {product.category || product.product_category}
        </div>
      ) : null}
      
      <div className="text-center p-3" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={product.image || product.product_image} 
          alt={product.title || product.product_title} 
          className="card-img-top" 
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
          }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">
          {product.title || product.product_title}
        </h5>
        
        {/* Show rating if available */}
        {(product.rating || product.product_rating) && renderRating(product.rating || product.product_rating)}
        
        <p className="product-price mb-1">
          ${(product.price || product.product_price).toFixed(2)}
        </p>
        
        <p className="card-text small mb-2" style={{ 
          overflow: 'hidden', 
          display: '-webkit-box', 
          WebkitBoxOrient: 'vertical', 
          WebkitLineClamp: 2,
          textOverflow: 'ellipsis',
          minHeight: '3em'
        }}>
          {product.description || product.product_description}
        </p>
        
        {addedBy && (
          <div className="d-flex align-items-center text-muted mb-2">
            <BsPerson className="me-1" />
            <small>
              Added by: {addedBy.full_name || addedBy.email}
            </small>
          </div>
        )}
        
        <div className="mt-auto">
          {showAddButton && (
            <button 
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
              onClick={() => onAddToWishlist(product)}
              aria-label="Add to wishlist"
            >
              <BsFillCartPlusFill className="me-2" /> Add to Wishlist
            </button>
          )}
          
          {/* Edit and remove buttons for manual products */}
          {isManual && onEdit && (
            <div className="d-flex flex-wrap mb-2 gap-2">
              <button 
                className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center"
                onClick={onEdit}
                aria-label="Edit product"
              >
                <BsPencil className="me-2" /> Edit
              </button>
              {onRemove && (
                <button 
                  className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center"
                  onClick={onRemove}
                  aria-label="Remove product"
                >
                  <BsTrash className="me-2" /> Remove
                </button>
              )}
            </div>
          )}
          
          {/* Remove button for non-manual products */}
          {!isManual && onRemove && (
            <button 
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
              onClick={onRemove}
              aria-label="Remove product"
            >
              <BsTrash className="me-2" /> Remove
            </button>
          )}
          
          {/* Social features section (likes and comments) */}
          {canShowSocial && (
            <div className="product-social mt-3">
              <button 
                className="btn btn-sm comments-toggle-btn w-100 d-flex align-items-center justify-content-center"
                onClick={() => setShowSocial(!showSocial)}
                aria-expanded={showSocial}
              >
                {showSocial ? <BsChevronUp className="me-1" /> : <BsChevronDown className="me-1" />}
                {showSocial ? 'Hide Social' : 'Show Likes & Comments'}
              </button>
              
              {showSocial && (
                <div className="social-content mt-2">
                  <ProductLikes wishlistId={wishlistId} itemId={productItemId} />
                  <hr className="my-2" />
                  <ProductComments wishlistId={wishlistId} itemId={productItemId} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
