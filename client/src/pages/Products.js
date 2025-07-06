import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService, wishlistService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { BsSearch, BsFilter, BsArrowLeft, BsCart4, BsGrid, BsList, BsCheck2Circle } from 'react-icons/bs';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wishlistId = location.state?.wishlistId;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlistId, setSelectedWishlistId] = useState(wishlistId || '');
  const [selectedWishlistName, setSelectedWishlistName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-asc', 'price-desc', 'name'

  useEffect(() => {
    fetchProducts();
    fetchWishlists();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productService.getFakeStoreProducts();
      setProducts(data.products);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.products.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlists = async () => {
    try {
      const { data } = await wishlistService.getWishlists();
      setWishlists(data.wishlists);
      
      // If wishlistId is provided, find its name
      if (wishlistId) {
        const selectedList = data.wishlists.find(list => list.id === wishlistId);
        if (selectedList) {
          setSelectedWishlistName(selectedList.name);
        }
      }
    } catch (err) {
      console.error('Error fetching wishlists:', err);
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!selectedWishlistId) {
      setError('Please select a wishlist first');
      return;
    }

    try {
      setLoading(true);
      await productService.addProductToWishlist(selectedWishlistId, {
        product_id: product.id,
        product_title: product.title,
        product_price: product.price,
        product_image: product.image,
        product_description: product.description,
        product_category: product.category,
        product_rating: product.rating
      });
      setSuccessMessage(`${product.title} added to wishlist!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error adding product to wishlist:', err);
      setError('Failed to add product to wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products) => {
    switch(sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name':
        return [...products].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      default:
        return products;
    }
  };

  let filteredProducts = products.filter(product => {
    const matchesFilter = filter 
      ? product.title.toLowerCase().includes(filter.toLowerCase()) || 
        product.description.toLowerCase().includes(filter.toLowerCase())
      : true;
      
    const matchesCategory = category 
      ? product.category === category
      : true;
      
    return matchesFilter && matchesCategory;
  });
  
  // Apply sorting
  filteredProducts = sortProducts(filteredProducts);

  if (loading && products.length === 0) {
    return (
      <div className="container mt-4 text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Browse Products</h2>
        <div>
          <button 
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <BsGrid />
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <BsList />
          </button>
        </div>
      </div>
      
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
            <BsCheck2Circle className="me-2" />
            {successMessage}
          </div>
        </div>
      )}
      
      <div className="filter-card mb-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="wishlistSelect" className="form-label d-flex align-items-center">
              <BsCart4 className="me-2" /> Select Wishlist
            </label>
            <div className="d-flex">
              <select
                className="form-select me-2"
                id="wishlistSelect"
                value={selectedWishlistId}
                onChange={(e) => {
                  setSelectedWishlistId(e.target.value);
                  const selected = wishlists.find(w => w.id === e.target.value);
                  setSelectedWishlistName(selected ? selected.name : '');
                }}
                required
              >
                <option value="">Select a wishlist...</option>
                {wishlists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
              <button 
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() => navigate('/wishlists')}
              >
                <BsArrowLeft className="me-1" /> My Lists
              </button>
            </div>
            {selectedWishlistName && (
              <div className="mt-2">
                <span className="badge bg-primary">Adding to: {selectedWishlistName}</span>
              </div>
            )}
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="searchFilter" className="form-label d-flex align-items-center">
              <BsSearch className="me-2" /> Search Products
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <BsSearch />
              </span>
              <input
                type="text"
                className="form-control"
                id="searchFilter"
                placeholder="Search by name or description..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="categoryFilter" className="form-label d-flex align-items-center">
                  <BsFilter className="me-2" /> Category
                </label>
                <select
                  className="form-select"
                  id="categoryFilter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="sortBy" className="form-label">Sort By</label>
                <select
                  className="form-select"
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {filteredProducts.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard
                product={product}
                onAddToWishlist={handleAddToWishlist}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div className="col-12 mb-3" key={product.id}>
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-md-3 p-3 text-center">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body d-flex flex-column h-100">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title">{product.title}</h5>
                        <span className="product-price">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="mb-2">
                        <span className="badge bg-primary">{product.category}</span>
                      </div>
                      <p className="card-text">{product.description}</p>
                      <div className="mt-auto">
                        <button 
                          className="btn btn-primary d-flex align-items-center"
                          onClick={() => handleAddToWishlist(product)}
                        >
                          <BsCart4 className="me-2" /> Add to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <BsSearch style={{ fontSize: '3rem' }} />
          <h3>No products found</h3>
          <p>Try adjusting your search filters</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setFilter('');
              setCategory('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
      
      <div className="text-center mt-4 mb-5">
        <button
          className="btn btn-outline-primary d-inline-flex align-items-center"
          onClick={() => navigate('/wishlists')}
        >
          <BsArrowLeft className="me-2" /> Back to My Wishlists
        </button>
      </div>
    </div>
  );
};

export default Products;
