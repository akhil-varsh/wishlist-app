import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="display-4 fw-bold mb-4">
            Plan Your Shopping Together
          </h1>
          <p className="lead mb-4">
            Create shared wishlists with friends and family. Add products, invite others, and
            collaborate on your shopping plans in real-time.
          </p>
          <div className="d-grid gap-2 d-md-flex">
            <Link to="/register" className="btn btn-primary btn-lg px-4 me-md-2">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
              Sign In
            </Link>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <img
            src="./home.png" // Replace with your actual image path
            alt="Wishlist App"
            className="img-fluid mt-4 mt-md-0"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>

      <div className="row mt-5 pt-5">
        <div className="col-12 text-center mb-4">
          <h2 className="fw-bold">How It Works</h2>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-list-check fs-1 text-primary"></i>
              </div>
              <h4>Create Wishlists</h4>
              <p>Create your own personalized wishlists for any occasion.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-cart-plus fs-1 text-primary"></i>
              </div>
              <h4>Add Products</h4>
              <p>Browse and add products from our catalog to your wishlists.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-people fs-1 text-primary"></i>
              </div>
              <h4>Collaborate</h4>
              <p>Invite friends and family to view and collaborate on your wishlists.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
