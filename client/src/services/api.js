import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => {
    console.log('Sending registration data to server:', { ...userData, password: '***' });
    return api.post('/auth/signup', userData);
  },
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
};

// Wishlist services
export const wishlistService = {
  getWishlists: () => api.get('/wishlists'),
  getWishlist: (id) => api.get(`/wishlists/${id}`),
  createWishlist: (wishlistData) => api.post('/wishlists', wishlistData),
  updateWishlist: (id, wishlistData) => api.put(`/wishlists/${id}`, wishlistData),
  deleteWishlist: (id) => api.delete(`/wishlists/${id}`),
  inviteToWishlist: (id, email) => api.post(`/wishlists/${id}/invite`, { email })
};

// Product services
export const productService = {
  getFakeStoreProducts: () => api.get('/products/fakestore'),
  addProductToWishlist: (wishlistId, productData) => api.post(`/products/wishlist/${wishlistId}`, productData),
  removeProductFromWishlist: (wishlistId, itemId) => api.delete(`/products/wishlist/${wishlistId}/${itemId}`),
  
  // Likes endpoints
  likeProduct: (wishlistId, itemId) => api.post(`/products/wishlist/${wishlistId}/${itemId}/like`),
  unlikeProduct: (wishlistId, itemId) => api.delete(`/products/wishlist/${wishlistId}/${itemId}/like`),
  getProductLikes: (wishlistId, itemId) => api.get(`/products/wishlist/${wishlistId}/${itemId}/likes`),
  
  // Comments endpoints
  addComment: (wishlistId, itemId, content) => api.post(`/products/wishlist/${wishlistId}/${itemId}/comment`, { content }),
  deleteComment: (wishlistId, itemId, commentId) => api.delete(`/products/wishlist/${wishlistId}/${itemId}/comment/${commentId}`),
  getComments: (wishlistId, itemId) => api.get(`/products/wishlist/${wishlistId}/${itemId}/comments`)
};

export default api;
