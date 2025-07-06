const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Sign up
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      console.error('No user data returned from signup');
      return res.status(400).json({ error: 'Failed to create user' });
    }

    console.log('Auth user created:', authData.user.id);

    // Create a profile record
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: full_name || '',
          },
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // We continue as the auth was successful
      }
      
      res.status(201).json({ 
        message: 'Signup successful', 
        user: { 
          id: authData.user.id, 
          email: authData.user.email 
        }
      });
    } catch (profileCreateError) {
      console.error('Exception creating profile:', profileCreateError);
      // Return success even if profile creation fails, as the auth account was created
      res.status(201).json({ 
        message: 'Signup successful, but profile creation failed', 
        user: { 
          id: authData.user.id, 
          email: authData.user.email 
        }
      });
    }
  } catch (signupError) {
    console.error('Exception during signup process:', signupError);
    return res.status(400).json({ error: 'Sign up process failed: ' + signupError.message });
  }
});

// Sign in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.status(200).json({ message: 'Login successful', session: data.session, user: data.user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Sign out
router.post('/logout', async (req, res) => {
  try {
    console.log('Logout request received');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Logout successful');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'An error occurred during logout' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'An error occurred while fetching profile' });
  }
});

module.exports = router;
