import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { BsChat, BsPerson, BsClockHistory, BsSend, BsTrash } from 'react-icons/bs';


const ProductComments = ({ wishlistId, itemId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments when component mounts or when showComments changes
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [wishlistId, itemId, showComments]);


  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await productService.getComments(wishlistId, itemId);
      setComments(data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle adding a new comment
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await productService.addComment(wishlistId, itemId, commentContent);
      setCommentContent('');
      await fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle deleting a comment
   */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      setLoading(true);
      await productService.deleteComment(wishlistId, itemId, commentId);
      await fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
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
    }) + ' at ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

 
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const canDeleteComment = (comment) => {
    const currentUserId = localStorage.getItem('userId');
    return comment.profiles.id === currentUserId;
  };

  return (
    <div className="product-comments mt-2">
      <button 
        className="btn btn-sm btn-outline-secondary"
        onClick={toggleComments}
        aria-expanded={showComments}
      >
        <BsChat className="me-1" /> 
        {comments.length > 0 ? `${comments.length} Comments` : 'Add Comment'}
      </button>
      
      {showComments && (
        <div className="comments-section mt-2 card">
          <div className="card-header py-2 bg-light">
            <h6 className="mb-0">Comments</h6>
          </div>
          
          {/* Add comment form */}
          <div className="card-body py-2">
            {error && <div className="alert alert-danger py-1 px-2 mb-2">{error}</div>}
            
            <form onSubmit={handleAddComment} className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting || !commentContent.trim()}
                >
                  <BsSend />
                </button>
              </div>
            </form>
            
            {/* Comments list */}
            {loading && comments.length === 0 ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mb-0 mt-1 small">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-muted text-center mb-0">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment mb-2 pb-2 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="comment-author mb-1">
                        <BsPerson className="me-1" />
                        <strong>{comment.profiles.full_name || comment.profiles.email}</strong>
                      </div>
                      {canDeleteComment(comment) && (
                        <button 
                          className="btn btn-sm text-danger p-0" 
                          onClick={() => handleDeleteComment(comment.id)}
                          aria-label="Delete comment"
                        >
                          <BsTrash />
                        </button>
                      )}
                    </div>
                    <div className="comment-content mb-1">{comment.content}</div>
                    <div className="comment-date text-muted small">
                      <BsClockHistory className="me-1" />
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComments;
