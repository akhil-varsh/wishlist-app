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

// Create a new wishlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Wishlist name is required' });
    }

    const { data, error } = await supabase
      .from('wishlists')
      .insert([
        {
          name,
          description: description || '',
          created_by: userId,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Wishlist created', wishlist: data[0] });
  } catch (error) {
    console.error('Create wishlist error:', error);
    res.status(500).json({ error: 'An error occurred while creating wishlist' });
  }
});

// Get all wishlists for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        profiles:created_by (full_name, email)
      `)
      .eq('created_by', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ wishlists: data });
  } catch (error) {
    console.error('Get wishlists error:', error);
    res.status(500).json({ error: 'An error occurred while fetching wishlists' });
  }
});

// Get a specific wishlist
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        profiles:created_by (full_name, email),
        wishlist_items (
          *,
          profiles:added_by (full_name, email)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.status(200).json({ wishlist: data });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'An error occurred while fetching wishlist' });
  }
});

// Update a wishlist
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    // Check if user is the creator of the wishlist
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .select('*')
      .eq('id', id)
      .single();

    if (wishlistError) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (wishlist.created_by !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this wishlist' });
    }

    const { data, error } = await supabase
      .from('wishlists')
      .update({
        name: name || wishlist.name,
        description: description !== undefined ? description : wishlist.description,
      })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Wishlist updated', wishlist: data[0] });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({ error: 'An error occurred while updating wishlist' });
  }
});

// Delete a wishlist
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is the creator of the wishlist
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .select('*')
      .eq('id', id)
      .single();

    if (wishlistError) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (wishlist.created_by !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this wishlist' });
    }

    // Delete associated wishlist items
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('wishlist_id', id);

    // Delete the wishlist
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Wishlist deleted' });
  } catch (error) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({ error: 'An error occurred while deleting wishlist' });
  }
});

// Invite functionality (mocked)
router.post('/:id/invite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user.id;

    // In a real app, this would send an email or create a share record
    // For now, we'll just validate the wishlist exists and return success
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .select('*')
      .eq('id', id)
      .single();

    if (wishlistError) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (wishlist.created_by !== userId) {
      return res.status(403).json({ error: 'Not authorized to invite to this wishlist' });
    }

    // Mock response
    res.status(200).json({ 
      message: `Invitation sent to ${email} for wishlist "${wishlist.name}"`,
      inviteId: 'mock-invite-id-' + Date.now()
    });
  } catch (error) {
    console.error('Invite error:', error);
    res.status(500).json({ error: 'An error occurred while processing invitation' });
  }
});

module.exports = router;
