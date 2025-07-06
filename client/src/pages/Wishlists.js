import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wishlistService } from '../services/api';
import WishlistCard from '../components/WishlistCard';
import CreateWishlistForm from '../components/CreateWishlistForm';

const Wishlists = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const { data } = await wishlistService.getWishlists();
      setWishlists(data.wishlists);
    } catch (err) {
      console.error('Error fetching wishlists:', err);
      setError('Failed to load wishlists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async (wishlistData) => {
    try {
      setLoading(true);
      await wishlistService.createWishlist(wishlistData);
      setShowCreateForm(false);
      await fetchWishlists();
    } catch (err) {
      console.error('Error creating wishlist:', err);
      setError('Failed to create wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      try {
        setLoading(true);
        await wishlistService.deleteWishlist(wishlistId);
        await fetchWishlists();
      } catch (err) {
        console.error('Error deleting wishlist:', err);
        setError('Failed to delete wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredWishlists = wishlists.filter(
    wishlist => 
      wishlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wishlist.description && wishlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && wishlists.length === 0) {
    return (
      <div className="container mt-5 py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your wishlists...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h1 className="mb-0 display-6">
            <i className="bi bi-list-check me-2"></i>
            My Wishlists
          </h1>
          {wishlists.length > 0 && (
            <p className="text-muted mt-2">
              You have {wishlists.length} wishlist{wishlists.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="col-lg-4 d-flex justify-content-lg-end align-items-center mt-3 mt-lg-0">
          <button
            className={`btn ${showCreateForm ? 'btn-secondary' : 'btn-primary'} d-flex align-items-center`}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <i className={`bi ${showCreateForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`}></i>
            {showCreateForm ? 'Cancel' : 'Create New Wishlist'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {showCreateForm && (
        <div className="mb-4 card shadow-sm border-primary">
          <div className="card-body">
            <CreateWishlistForm
              onSubmit={handleCreateWishlist}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {wishlists.length > 0 && (
        <div className="mb-4 mt-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search your wishlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary border-start-0" 
                type="button"
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      )}

      {wishlists.length === 0 && !loading ? (
        <div className="text-center py-5 mt-4 card shadow-sm border-0">
          <div className="card-body py-5">
            <i className="bi bi-list-stars text-muted mb-3" style={{fontSize: '3rem'}}></i>
            <h3>You don't have any wishlists yet</h3>
            <p className="mb-4 text-muted">Create your first wishlist to get started!</p>
            {!showCreateForm && (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setShowCreateForm(true)}
              >
                <i className="bi bi-plus me-2"></i>
                Create Your First Wishlist
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredWishlists.map((wishlist) => (
            <div className="col" key={wishlist.id}>
              <WishlistCard
                wishlist={wishlist}
                onDelete={handleDeleteWishlist}
              />
            </div>
          ))}
          {filteredWishlists.length === 0 && searchTerm && (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No wishlists match your search for "{searchTerm}"</p>
              <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlists;
