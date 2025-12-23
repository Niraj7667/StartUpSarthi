const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

class AuthController {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  // Signup
  async signup(req, res) {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'All fields are required',
          details: 'Email, password, and name must be provided'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password too short',
          details: 'Password must be at least 6 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          details: 'An account with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name.trim(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });

      // Generate token
      const token = this.generateToken(user.id);

      res.status(201).json({
        message: 'Account created successfully',
        user,
        token,
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: 'Failed to create account',
        details: 'An internal server error occurred'
      });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          details: 'No account found with this email'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials',
          details: 'Incorrect password'
        });
      }

      // Generate token
      const token = this.generateToken(user.id);

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        details: 'An internal server error occurred'
      });
    }
  }

  // Claim Profile - Link guest searches to new user account
  async claimProfile(req, res) {
    try {
      const { sessionId } = req.body;
      const userId = req.user.id;

      if (!sessionId) {
        return res.status(400).json({
          error: 'Session ID is required'
        });
      }

      // Update guest searches to be associated with the user
      const updatedSearches = await prisma.searchHistory.updateMany({
        where: {
          sessionId: sessionId,
          userId: null
        },
        data: {
          userId: userId,
          sessionId: null // Clear session ID as it's now linked to user
        }
      });

      res.json({
        message: 'Profile claimed successfully',
        claimedSearches: updatedSearches.count
      });

    } catch (error) {
      console.error('Claim profile error:', error);
      res.status(500).json({
        error: 'Failed to claim profile',
        details: 'An internal server error occurred'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              searchHistory: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({
        user: {
          ...user,
          totalSearches: user._count.searchHistory
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get profile',
        details: 'An internal server error occurred'
      });
    }
  }
}

module.exports = new AuthController();