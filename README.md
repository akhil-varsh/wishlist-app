# Shared Wishlist App

A collaborative product wishlist application where users can create, manage, and share wishlists with others in real-time.

## Features

- User authentication (sign up, login, logout)
- Create, view, edit, and delete wishlists
- Add products to wishlists from the FakeStore API
- Manually add custom products with name, image URL, and price
- Remove products from wishlists
- Like and comment on products in wishlists
- Invite others to join a wishlist (mocked)
- View who added which items
- Filter and search products
- Mobile-responsive design

## Assumptions and Limitations

- The application uses mock data for likes and comments instead of storing them in the database
- The invitation functionality is mocked and doesn't send actual emails
- Manual products are stored in session state only and not persisted to the database
- The application uses the FakeStore API for product data
- Authentication is handled through Supabase Auth

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Bootstrap for styling
- Axios for API requests
- React Icons for UI elements

### Backend
- Node.js with Express
- REST API architecture
- JWT for authentication

### Database
- Supabase (PostgreSQL)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/wishlist-app.git
cd wishlist-app
```

2. Set up the backend:
```
cd server
npm install
```

3. Create a `.env` file in the server directory and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5000
```

4. Set up the frontend:
```
cd ../client
npm install
```

5. Create a `.env` file in the client directory and add:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

### Running the App

1. Start the backend server:
```
cd server
npm run dev
```

2. In a new terminal, start the React frontend:
```
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Database Schema

The application uses the following database tables:

### profiles
- id (uuid, primary key, references auth.users)
- full_name (text)
- email (text, unique)
- created_at (timestamp)

### wishlists
- id (uuid, primary key)
- name (text)
- description (text)
- created_by (uuid, references profiles)
- created_at (timestamp)

### wishlist_items
- id (uuid, primary key)
- wishlist_id (uuid, references wishlists)
- product_id (integer)
- product_title (text)
- product_price (numeric)
- product_image (text)
- product_description (text)
- product_category (text)
- product_rating (jsonb)
- added_by (uuid, references profiles)
- added_at (timestamp)
- is_manual (boolean, default false)

### product_likes
- id (uuid, primary key)
- wishlist_item_id (uuid, references wishlist_items)
- user_id (uuid, references profiles)
- created_at (timestamp)

### product_comments
- id (uuid, primary key)
- wishlist_item_id (uuid, references wishlist_items)
- user_id (uuid, references profiles)
- content (text)
- created_at (timestamp)

## API Endpoints

### Authentication
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/profile - Get user profile

### Wishlists
- GET /api/wishlists - Get all wishlists for the user
- GET /api/wishlists/:id - Get a specific wishlist with items
- POST /api/wishlists - Create a new wishlist
- PUT /api/wishlists/:id - Update a wishlist
- DELETE /api/wishlists/:id - Delete a wishlist
- POST /api/wishlists/:id/invite - Invite a user to a wishlist

### Products
- GET /api/products/fakestore - Get products from FakeStore API
- POST /api/products/wishlist/:wishlistId - Add a product to a wishlist
- DELETE /api/products/wishlist/:wishlistId/:itemId - Remove a product from a wishlist

### Likes and Comments
- POST /api/products/wishlist/:wishlistId/:itemId/like - Like a product
- DELETE /api/products/wishlist/:wishlistId/:itemId/like - Unlike a product
- GET /api/products/wishlist/:wishlistId/:itemId/likes - Get all likes for a product
- POST /api/products/wishlist/:wishlistId/:itemId/comment - Add a comment to a product
- DELETE /api/products/wishlist/:wishlistId/:itemId/comment/:commentId - Delete a comment
- GET /api/products/wishlist/:wishlistId/:itemId/comments - Get all comments for a product

## Future Improvements

If I had more time, I would implement:

- Real-time Updates: Add WebSocket support for real-time collaboration
- Enhanced Security: Implement CSRF protection and rate limiting
- Email Integration: Add actual email notifications for invitations
- Persistent Manual Products: Store manual products in the database
- Enhanced Social Features: Implement user profiles and notifications
- Offline Support: Add service workers for offline functionality
- Advanced Search: Implement more advanced filtering and search options
- Testing: Add comprehensive unit and integration tests

## License

This project is licensed under the MIT License.
