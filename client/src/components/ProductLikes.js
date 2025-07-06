import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { BsHeart, BsHeartFill, BsPerson, BsClockHistory } from 'react-icons/bs';


const ProductLikes = ({ wishlistId, itemId }) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLiked, setUserLiked] = useState(false);
  const [showLikesDetails, setShowLikesDetails] = useState(false);

  // Fetch likes when component mounts
  useEffect(() => {
    fetchLikes();
  }, [wishlistId, itemId]);

 
  const fetchLikes = async () => {
    try {
      setLoading(true);
      const { data } = await productService.getProductLikes(wishlistId, itemId);
      setLikes(data.likes);
      
      // Check if current user has liked this product
      const currentUserId = localStorage.getItem('userId');
      setUserLiked(data.likes.some(like => like.profiles.id === currentUserId));
    } catch (err) {
      console.error('Error fetching likes:', err);
      setError('Failed to load likes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      setLoading(true);
      
      if (userLiked) {
        await productService.unlikeProduct(wishlistId, itemId);
      } else {
        await productService.likeProduct(wishlistId, itemId);
      }
      
      // Refresh likes
      await fetchLikes();
    } catch (err) {
      console.error('Error toggling like:', err);
      setError(userLiked ? 'Failed to unlike' : 'Failed to like');
    } finally {
      setLoading(false);
    }
  };

 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  
  const toggleLikesDetails = () => {
    setShowLikesDetails(!showLikesDetails);
  };

  return (
    <div className="product-likes">
      {error && <div className="text-danger small">{error}</div>}
      
      <div className="d-flex align-items-center">
        <button 
          className={`btn btn-sm ${userLiked ? 'btn-danger' : 'btn-outline-danger'} me-2`}
          onClick={handleToggleLike}
          disabled={loading}
          aria-label={userLiked ? "Unlike" : "Like"}
        >
          {userLiked ? <BsHeartFill /> : <BsHeart />}
        </button>
        
        {likes.length > 0 ? (
          <button 
            className="like-count btn btn-sm btn-link text-decoration-none p-0"
            onClick={toggleLikesDetails}
            aria-label="Show likes"
            aria-expanded={showLikesDetails}
          >
            {likes.length} {likes.length === 1 ? 'like' : 'likes'}
          </button>
        ) : (
          <span className="like-count text-muted">
            {likes.length} {likes.length === 1 ? 'like' : 'likes'}
          </span>
        )}
      </div>
      
      {/* Likes details popup */}
      {showLikesDetails && likes.length > 0 && (
        <div className="likes-details card mt-2">
          <div className="card-header py-2 bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Likes</h6>
              <button 
                type="button" 
                className="btn-close btn-sm" 
                aria-label="Close"
                onClick={toggleLikesDetails}
              ></button>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            {likes.map(like => (
              <li key={like.id} className="list-group-item py-2">
                <div className="d-flex flex-wrap align-items-center">
                  <div className="me-auto mb-1 mb-md-0">
                    <BsPerson className="me-1" />
                    <span className="text-truncate" style={{ maxWidth: '150px', display: 'inline-block' }}>
                      {like.profiles.full_name || like.profiles.email}
                    </span>
                  </div>
                  <div className="text-muted small">
                    <BsClockHistory className="me-1" />
                    <span>{formatDate(like.created_at)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductLikes;
