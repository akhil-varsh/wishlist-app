import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wishlistService, productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import InviteForm from '../components/InviteForm';
import ManualProductForm from '../components/ManualProductForm';
import { 
  BsCalendar3, 
  BsPerson, 
  BsPlus, 
  BsPeopleFill, 
  BsArrowLeft, 
  BsGift,
  BsPencil
} from 'react-icons/bs';

const WishlistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Manual product management states
  const [showManualProductForm, setShowManualProductForm] = useState(false);
  const [manualProducts, setManualProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, [id]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await wishlistService.getWishlist(id);
      setWishlist(data.wishlist);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (email) => {
    try {
      setLoading(true);
      const { data } = await wishlistService.inviteToWishlist(id, email);
      setSuccessMessage(data.message);
      setShowInviteForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error inviting user:', err);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        setLoading(true);
        await productService.removeProductFromWishlist(id, itemId);
        await fetchWishlist();
        setSuccessMessage('Item removed successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error('Error removing item:', err);
        setError('Failed to remove item. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Manual product management functions
  const handleAddManualProduct = (product) => {
    if (editingProduct) {
      // Update existing product
      setManualProducts(manualProducts.map(p => 
        p.id === editingProduct.id ? product : p
      ));
      setSuccessMessage('Product updated successfully!');
    } else {
      // Add new product
      setManualProducts([...manualProducts, product]);
      setSuccessMessage('Product added successfully!');
    }
    
    setShowManualProductForm(false);
    setEditingProduct(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleEditManualProduct = (product) => {
    setEditingProduct(product);
    setShowManualProductForm(true);
  };

  const handleRemoveManualProduct = (productId) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      setManualProducts(manualProducts.filter(p => p.id !== productId));
      setSuccessMessage('Product removed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const cancelManualProductForm = () => {
    setShowManualProductForm(false);
    setEditingProduct(null);
  };

  if (loading && !wishlist) {
    return (
      <div className="container mt-4 text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading wishlist details...</p>
      </div>
    );
  }

  if (!wishlist && !loading) {
    return (
      <div className="container mt-4">
        <div className="empty-state">
          <BsGift />
          <h3>Wishlist not found</h3>
          <p className="mb-4">The wishlist you're looking for doesn't exist or you don't have access to it.</p>
          <button
            className="btn btn-primary d-flex align-items-center mx-auto"
            onClick={() => navigate('/wishlists')}
          >
            <BsArrowLeft className="me-2" /> Back to My Wishlists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <div>{error}</div>
        </div>
      )}
      
      {successMessage && (
        <div className="success-toast">
          <div className="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      <div className="wishlist-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1">{wishlist?.name}</h2>
            {wishlist?.description && <p className="mb-2">{wishlist.description}</p>}
            
            <div className="wishlist-meta">
              <div className="me-3">
                <BsPerson /> {wishlist?.profiles?.full_name || wishlist?.profiles?.email}
              </div>
              <div className="me-3">
                <BsCalendar3 /> {new Date(wishlist?.created_at).toLocaleDateString()}
              </div>
              <div>
                <BsGift /> {(wishlist?.wishlist_items?.length || 0) + manualProducts.length} items
              </div>
            </div>
          </div>
          
          <div className="d-flex">
            <button
              className="btn btn-light me-2 d-flex align-items-center py-1"
              onClick={() => navigate('/products', { state: { wishlistId: id } })}
            >
              <BsPlus className="me-1" /> Add Products
            </button>
            <button
              className="btn btn-light me-2 d-flex align-items-center py-1"
              onClick={() => {
                setEditingProduct(null);
                setShowManualProductForm(!showManualProductForm);
              }}
            >
              <BsPlus className="me-1" /> Add Manual Product
            </button>
            <button
              className="btn btn-light d-flex align-items-center py-1"
              onClick={() => setShowInviteForm(!showInviteForm)}
            >
              <BsPeopleFill className="me-1" /> {showInviteForm ? 'Cancel' : 'Invite'}
            </button>
          </div>
        </div>
      </div>

      {showInviteForm && (
        <div className="mb-4">
          <InviteForm
            onSubmit={handleInvite}
            onCancel={() => setShowInviteForm(false)}
          />
        </div>
      )}

      {showManualProductForm && (
        <div className="mb-4">
          <ManualProductForm
            onSubmit={handleAddManualProduct}
            onCancel={cancelManualProductForm}
            initialProduct={editingProduct}
            isEditing={!!editingProduct}
          />
        </div>
      )}

      {/* Display manual products if any */}
      {manualProducts.length > 0 && (
        <>
          <h4 className="mt-4 mb-3">Custom Products</h4>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {manualProducts.map((product) => (
              <div className="col" key={product.id}>
                <ProductCard
                  product={product}
                  showAddButton={false}
                  onRemove={() => handleRemoveManualProduct(product.id)}
                  onEdit={() => handleEditManualProduct(product)}
                  isManual={true}
                  wishlistId={id}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Display wishlist items or empty state */}
      {(wishlist?.wishlist_items?.length > 0 || manualProducts.length > 0) ? (
        <>
          {wishlist?.wishlist_items?.length > 0 && (
            <>
              <h4 className="mt-4 mb-3">Wishlist Items</h4>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {wishlist?.wishlist_items?.map((item) => (
                  <div className="col" key={item.id}>
                    <ProductCard
                      product={{
                        id: item.id, // Pass item.id as product.id for likes/comments
                        product_id: item.product_id,
                        product_title: item.product_title,
                        product_price: item.product_price,
                        product_image: item.product_image,
                        product_description: item.product_description,
                        product_category: item.product_category,
                        product_rating: item.product_rating
                      }}
                      showAddButton={false}
                      addedBy={item.profiles}
                      onRemove={() => handleRemoveItem(item.id)}
                      wishlistId={id}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="empty-state">
          <BsGift />
          <h3>No items in this wishlist yet</h3>
          <p className="mb-4">Start adding products to build your wishlist!</p>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary d-flex align-items-center me-2"
              onClick={() => navigate('/products', { state: { wishlistId: id } })}
            >
              <BsPlus className="me-2" /> Browse Products
            </button>
            <button
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={() => {
                setEditingProduct(null);
                setShowManualProductForm(true);
              }}
            >
              <BsPlus className="me-2" /> Add Manual Product
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center mt-4 mb-5">
        <button
          className="btn btn-outline-primary d-inline-flex align-items-center py-1"
          onClick={() => navigate('/wishlists')}
        >
          <BsArrowLeft className="me-2" /> Back to My Wishlists
        </button>
      </div>
    </div>
  );
};

export default WishlistDetail;
