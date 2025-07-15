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
git clone https://github.com/akhil-varsh/wishlist-app.git
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


## Future Improvements

- Real-time Updates: Add WebSocket support for real-time collaboration
- Enhanced Security: Implement CSRF protection and rate limiting
- Email Integration: Add actual email notifications for invitations
- Persistent Manual Products: Store manual products in the database
- Enhanced Social Features: Implement user profiles and notifications
- Offline Support: Add service workers for offline functionality
- Advanced Search: Implement more advanced filtering and search options
- Testing: Add comprehensive unit and integration tests


