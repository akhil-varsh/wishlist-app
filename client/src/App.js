import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlists from './pages/Wishlists';
import WishlistDetail from './pages/WishlistDetail';
import Products from './pages/Products';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/wishlists" 
                element={
                  <PrivateRoute>
                    <Wishlists />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/wishlists/:id" 
                element={
                  <PrivateRoute>
                    <WishlistDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="bg-light py-3 mt-auto">
            <div className="container text-center">
              <p className="text-muted mb-0">
                &copy; {new Date().getFullYear()} Shared Wishlist App
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
