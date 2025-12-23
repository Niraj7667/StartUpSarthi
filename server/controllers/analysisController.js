const { prisma } = require('../config/database');
const aiService = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');

class AnalysisController {
  // Analyze business idea (guest or authenticated)
  async analyzeIdea(req, res) {
    try {
      const { businessIdea, sessionId } = req.body;
      const userId = req.user?.id || null;

      // Validation
      if (!businessIdea || businessIdea.trim().length === 0) {
        return res.status(400).json({
          error: 'Business idea is required',
          details: 'Please provide a business idea to analyze'
        });
      }

      if (businessIdea.length > 1000) {
        return res.status(400).json({
          error: 'Business idea too long',
          details: 'Please limit your business idea to 1000 characters'
        });
      }

      // Generate session ID for guest users if not provided
      const currentSessionId = userId ? null : (sessionId || uuidv4());

      // Get AI analysis
      console.log('Analyzing business idea:', businessIdea.substring(0, 100) + '...');
      const aiAnalysis = await aiService.analyzeBusinessIdea(businessIdea);

      // Save to database
      const searchRecord = await prisma.searchHistory.create({
        data: {
          userId: userId,
          businessIdea: businessIdea.trim(),
          aiAnalysis: aiAnalysis,
          sessionId: currentSessionId,
        },
        include: {
          user: userId ? {
            select: {
              id: true,
              name: true,
              email: true
            }
          } : false
        }
      });

      res.json({
        message: 'Analysis completed successfully',
        analysis: aiAnalysis,
        searchId: searchRecord.id,
        sessionId: currentSessionId, // Return session ID for guest users
        user: searchRecord.user || null
      });

    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze business idea',
        details: 'An internal server error occurred during analysis'
      });
    }
  }

  // Get user's search history (authenticated only)
  async getSearchHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get paginated search history
      const [searches, totalCount] = await Promise.all([
        prisma.searchHistory.findMany({
          where: { userId: userId },
          orderBy: { createdAt: 'desc' },
          skip: skip,
          take: parseInt(limit),
          select: {
            id: true,
            businessIdea: true,
            aiAnalysis: true,
            createdAt: true,
          }
        }),
        prisma.searchHistory.count({
          where: { userId: userId }
        })
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        searches,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('Get search history error:', error);
      res.status(500).json({
        error: 'Failed to get search history',
        details: 'An internal server error occurred'
      });
    }
  }

  // Get specific search by ID
  async getSearchById(req, res) {
    try {
      const { searchId } = req.params;
      const userId = req.user?.id;

      // Build where clause - allow access if user owns it OR if it's a guest search with matching session
      const whereClause = userId 
        ? { id: searchId, userId: userId }
        : { id: searchId, userId: null };

      const search = await prisma.searchHistory.findFirst({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!search) {
        return res.status(404).json({
          error: 'Search not found',
          details: 'The requested analysis could not be found'
        });
      }

      res.json({
        search
      });

    } catch (error) {
      console.error('Get search by ID error:', error);
      res.status(500).json({
        error: 'Failed to get search',
        details: 'An internal server error occurred'
      });
    }
  }

  // Delete search (authenticated only)
  async deleteSearch(req, res) {
    try {
      const { searchId } = req.params;
      const userId = req.user.id;

      // Check if search exists and belongs to user
      const search = await prisma.searchHistory.findFirst({
        where: {
          id: searchId,
          userId: userId
        }
      });

      if (!search) {
        return res.status(404).json({
          error: 'Search not found',
          details: 'The requested analysis could not be found or does not belong to you'
        });
      }

      // Delete the search
      await prisma.searchHistory.delete({
        where: { id: searchId }
      });

      res.json({
        message: 'Search deleted successfully'
      });

    } catch (error) {
      console.error('Delete search error:', error);
      res.status(500).json({
        error: 'Failed to delete search',
        details: 'An internal server error occurred'
      });
    }
  }

  // Get dashboard stats (authenticated only)
  async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;

      // Get various statistics
      const [
        totalSearches,
        recentSearches,
        topCategories
      ] = await Promise.all([
        // Total searches count
        prisma.searchHistory.count({
          where: { userId: userId }
        }),

        // Recent searches (last 5)
        prisma.searchHistory.findMany({
          where: { userId: userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            businessIdea: true,
            createdAt: true,
            aiAnalysis: {
              select: {
                viabilityScore: true
              }
            }
          }
        }),

        // This would require more complex aggregation in a real app
        // For now, we'll return empty array
        []
      ]);

      res.json({
        stats: {
          totalSearches,
          recentSearches,
          topCategories
        }
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        error: 'Failed to get dashboard stats',
        details: 'An internal server error occurred'
      });
    }
  }
}

module.exports = new AnalysisController();