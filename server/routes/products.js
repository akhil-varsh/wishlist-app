const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Middleware to verify user token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Fetch products from FakeStore API
router.get('/fakestore', async (req, res) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
});

// Add product to wishlist
router.post('/wishlist/:wishlistId', authenticateToken, async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const { 
      product_id, 
      product_title, 
      product_price, 
      product_image, 
      product_description, 
      product_category,
      product_rating
    } = req.body;
    const userId = req.user.id;

    // Check if wishlist exists
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .select('*')
      .eq('id', wishlistId)
      .single();

    if (wishlistError) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    // Add product to wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([
        {
          wishlist_id: wishlistId,
          product_id,
          product_title,
          product_price,
          product_image,
          product_description,
          product_category,
          product_rating,
          added_by: userId,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Product added to wishlist', item: data[0] });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'An error occurred while adding product to wishlist' });
  }
});

// Remove product from wishlist
router.delete('/wishlist/:wishlistId/:itemId', authenticateToken, async (req, res) => {
  try {
    const { wishlistId, itemId } = req.params;
    const userId = req.user.id;

  
    const { data: item, error: itemError } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('id', itemId)
      .eq('wishlist_id', wishlistId)
      .single();

    if (itemError) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

  
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .select('created_by')
      .eq('id', wishlistId)
      .single();

    if (wishlistError) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (wishlist.created_by !== userId && item.added_by !== userId) {
      return res.status(403).json({ error: 'Not authorized to remove this item' });
    }

   
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Remove product error:', error);
    res.status(500).json({ error: 'An error occurred while removing product from wishlist' });
  }
});

// Like a product (static implementation)
router.post('/wishlist/:wishlistId/:itemId/like', authenticateToken, async (req, res) => {
  try {
    const { wishlistId, itemId } = req.params;
    const userId = req.user.id;

    // Return a mock response without database interaction
    res.status(201).json({ 
      message: 'Product liked successfully', 
      like: {
        id: 'mock-like-id-' + Date.now(),
        created_at: new Date().toISOString(),
        user_id: userId
      } 
    });
  } catch (error) {
    console.error('Like product error:', error);
    res.status(500).json({ error: 'An error occurred while liking the product' });
  }
});

// Unlike a product (static implementation)
router.delete('/wishlist/:wishlistId/:itemId/like', authenticateToken, async (req, res) => {
  try {
    const { wishlistId, itemId } = req.params;
    
    // Return a mock response without database interaction
    res.status(200).json({ message: 'Product unliked successfully' });
  } catch (error) {
    console.error('Unlike product error:', error);
    res.status(500).json({ error: 'An error occurred while unliking the product' });
  }
});

// Get all likes for a product (static implementation)
router.get('/wishlist/:wishlistId/:itemId/likes', authenticateToken, async (req, res) => {
  try {
    const { wishlistId, itemId } = req.params;

    // Mock likes data
    const mockLikes = [
      {
        id: 'mock-like-1',
        created_at: new Date().toISOString(),
        profiles: { 
          id: req.user.id,
          full_name: 'Current User',
          email: req.user.email 
        }
      },
      {
        id: 'mock-like-2',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        profiles: { 
          id: 'mock-user-1',
          full_name: 'Alice Johnson',
          email: 'alice@example.com' 
        }
      },
      {
        id: 'mock-like-3',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        profiles: { 
          id: 'mock-user-2',
          full_name: 'Bob Smith',
          email: 'bob@example.com' 
        }
      }
    ];

    res.status(200).json({ 
      likes: mockLikes,
      count: mockLikes.length 
    });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ error: 'An error occurred while fetching likes' });
  }
});

// Add a comment to a product (static implementation)
router.post('/wishlist/:wishlistId/:itemId/comment', authenticateToken, async (req, res) => {
  try {
    const { wishlistId, itemId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    // Return a mock response without database interaction
    res.status(201).json({ 
      message: 'Comment added successfully', 
      comment: {
        id: 'mock-comment-id-' + Date.now(),
        content: content,
        created_at: new Date().toISOString(),
        user_id: userId,
        profiles: {
          id: userId,
          full_name: 'Current User',
          email: req.user.email
        }
      } 
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'An error occurred while adding the comment' });
  }
});

// Delete a comment (static implementation)
router.delete('/wishlist/:wishlistId/:itemId/comment/:commentId', authenticateToken, async (req, res) => {
  try {
    const { wishlistId, itemId, commentId } = req.params;
    
    // Return a mock response without database interaction
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'An error occurred while deleting the comment' });
  }
});

// Get all comments for a product (static implementation)
router.get('/wishlist/:wishlistId/:itemId/comments', authenticateToken, async (req, res) => {
  try {
    const { wishlistId, itemId } = req.params;

    // Mock comments data
    const mockComments = [
      {
        id: 'mock-comment-1',
        content: 'This is exactly what I was looking for!',
        created_at: new Date().toISOString(),
        profiles: { 
          id: req.user.id,
          full_name: 'Current User',
          email: req.user.email 
        }
      },
      {
        id: 'mock-comment-2',
        content: 'Great find! I love this product.',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        profiles: { 
          id: 'mock-user-1',
          full_name: 'Alice Johnson',
          email: 'alice@example.com' 
        }
      },
      {
        id: 'mock-comment-3',
        content: 'I already have this and can confirm it\'s worth the price!',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        profiles: { 
          id: 'mock-user-2',
          full_name: 'Bob Smith',
          email: 'bob@example.com' 
        }
      }
    ];

    res.status(200).json({ comments: mockComments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'An error occurred while fetching comments' });
  }
});

module.exports = router;
