# StartupSaarthi - AI Co-Pilot for Indian Entrepreneurs

A comprehensive MVP that helps Indian entrepreneurs understand business compliance requirements, market analysis, and strategic planning using AI.

## 🎯 What it does

StartupSaarthi provides comprehensive business analysis including:
- **Viability Assessment** - Market, financial, and regulatory viability scores
- **Target Audience Analysis** - Primary/secondary demographics and market size
- **Competitor Landscape** - Direct/indirect competitors and market gaps
- **Mandatory Licenses** - Required Indian business licenses and registrations
- **Strategic Roadmap** - Phase-wise implementation plan with timelines
- **Financial Projections** - Investment requirements and revenue projections
- **Risk Assessment** - Identified risks with mitigation strategies
- **Government Schemes** - Relevant funding and support programs
- **Next Steps** - Immediate, short-term, and long-term action items

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express + CommonJS
- **Database**: MongoDB Atlas + Prisma ORM v5.7.1
- **Authentication**: Passport.js + JWT Strategy
- **AI**: Google Gemini 2.5 Flash API (JSON Mode)
- **Styling**: Vanilla CSS

## 📁 Project Structure

```
startupsaarthi-mvp/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   └── Dashboard.jsx   # Results display
│   │   ├── services/
│   │   │   └── api.js          # API integration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express backend
│   ├── config/
│   │   ├── database.js         # Prisma configuration
│   │   └── passport.js         # JWT strategy
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   └── analysisController.js # Business analysis
│   ├── middleware/
│   │   └── auth.js             # Auth middleware
│   ├── routes/
│   │   ├── auth.js             # Auth endpoints
│   │   └── analysis.js         # Analysis endpoints
│   ├── services/
│   │   └── aiService.js        # Gemini AI integration
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── index.js                # Main server file
│   ├── package.json
│   └── .env.example
├── package.json                # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account and cluster
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone and install dependencies:**
```bash
npm run install-all
```

2. **Set up environment variables:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
GEMINI_API_KEY="your_actual_gemini_api_key"
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/startupsaarthi"
JWT_SECRET="your-super-secret-jwt-key-make-it-long"
SESSION_SECRET="your-session-secret-make-it-long"
PORT=5000
```

3. **Generate Prisma client:**
```bash
cd server
npm run db:generate
```

4. **Start development servers:**
```bash
# From root directory
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:3001

### Alternative: Start servers separately

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

## 🔧 API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST /api/auth/login
Authenticate user and get JWT token.
```json
{
  "email": "user@example.com", 
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

#### POST /api/auth/claim-profile
Link guest searches to user account after signup.
```json
{
  "sessionId": "guest-session-uuid"
}
```

### Analysis Endpoints

#### POST /api/analysis/analyze
Analyze business idea (guest-friendly).
```json
{
  "businessIdea": "I want to start a cloud kitchen in Mumbai",
  "sessionId": "optional-guest-session-id"
}
```

**Response:**
```json
{
  "message": "Analysis completed successfully",
  "analysis": {
    "viabilityScore": {
      "overall": 78,
      "market": 82,
      "financial": 75,
      "regulatory": 80,
      "explanation": "Strong market potential with manageable regulatory requirements"
    },
    "targetAudience": {
      "primary": "Urban working professionals aged 25-40",
      "secondary": "College students and young families",
      "marketSize": "₹50,000+ crores in Indian food delivery market",
      "demographics": ["Tech-savvy millennials", "Busy professionals", "Health-conscious consumers"]
    },
    "competitorLandscape": {
      "directCompetitors": ["Swiggy", "Zomato", "Local cloud kitchens"],
      "indirectCompetitors": ["Traditional restaurants", "Home cooking", "Meal kit services"],
      "marketGap": "Specialized regional cuisine with premium quality",
      "competitiveAdvantage": "Authentic local flavors with modern convenience"
    },
    "mandatoryLicenses": [
      {
        "name": "FSSAI License",
        "authority": "Food Safety and Standards Authority of India",
        "timeline": "7-15 days",
        "cost": "₹7,500 - ₹37,500",
        "priority": "High",
        "description": "Mandatory food safety license for commercial food operations"
      }
    ],
    "roadmap": [
      {
        "phase": "Phase 1: Foundation & Planning",
        "duration": "1-2 months",
        "tasks": ["Market research", "Menu development", "Location scouting"],
        "milestones": ["Finalized business plan", "Secured location"],
        "estimatedCost": "₹2-5 lakhs"
      }
    ],
    "financialProjection": {
      "initialInvestment": "₹8-15 lakhs",
      "monthlyOperatingCost": "₹2-4 lakhs",
      "breakEvenTimeline": "8-12 months",
      "revenueStreams": ["Food delivery orders", "Catering services", "Subscription meals"]
    },
    "riskAssessment": {
      "high": ["Intense competition", "Food safety compliance"],
      "medium": ["Supply chain disruptions", "Customer acquisition costs"],
      "low": ["Seasonal demand variations"],
      "mitigation": "Focus on unique value proposition and maintain strict quality standards"
    },
    "governmentSchemes": [
      {
        "name": "PMEGP",
        "type": "Government",
        "eligibility": "New entrepreneurs above 18 years",
        "benefits": "Subsidy up to 35% of project cost",
        "applicationProcess": "Apply through KVIC or DIC offices"
      }
    ],
    "nextSteps": {
      "immediate": "Conduct detailed market research and finalize business model",
      "shortTerm": "Secure funding and obtain necessary licenses",
      "longTerm": "Scale operations and expand to multiple locations"
    }
  },
  "searchId": "unique-search-id",
  "sessionId": "guest-session-uuid",
  "user": null
}
```

#### GET /api/analysis/history
Get user's search history (requires authentication).

#### GET /api/analysis/search/:searchId
Get specific search by ID.

#### DELETE /api/analysis/search/:searchId
Delete a search (requires authentication).

#### GET /api/analysis/dashboard/stats
Get dashboard statistics (requires authentication).

## 🎨 Key Features

### 1. Guest-First Analysis
- Unauthenticated users can generate comprehensive business reports
- Session-based tracking for guest users
- Seamless transition from guest to authenticated user

### 2. Profile Claiming
- When guests sign up, they can claim their previous analyses
- Links anonymous searches to user accounts
- Preserves analysis history across sessions

### 3. Enhanced AI Analysis
- Uses Gemini 2.5 Flash with JSON mode for structured responses
- Comprehensive business analysis covering 9 key areas
- Indian market context and regulatory focus
- Fallback responses for error handling

### 4. Robust Authentication
- JWT-based authentication with Passport.js
- Secure password hashing with bcrypt
- Session management for guest users
- Protected and optional authentication routes

### 5. Database Persistence
- MongoDB Atlas with Prisma ORM
- User management with encrypted passwords
- Search history with full AI analysis storage
- Efficient querying and pagination

## 🧪 Testing the Application

### Sample Business Ideas to Test:
- "Cloud kitchen serving traditional South Indian cuisine in Bangalore"
- "E-commerce platform for handmade crafts and textiles"
- "Digital marketing agency specializing in small businesses"
- "Organic farming and direct-to-consumer vegetable delivery"
- "Mobile app for local service providers (plumbers, electricians)"
- "Co-working space in tier-2 cities"
- "Online tutoring platform for competitive exams"

### Testing Workflow:
1. **Guest Analysis**: Test business idea analysis without signup
2. **User Registration**: Create account and test authentication
3. **Profile Claiming**: Link guest searches to new account
4. **Dashboard**: View search history and statistics
5. **API Testing**: Use tools like Postman to test all endpoints

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Secure authentication with 7-day expiry
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error messages without data leakage
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Sensitive data in environment files

## 📊 Database Schema

### User Model
```prisma
model User {
  id            String          @id @default(auto()) @map("_id") @db.ObjectId
  email         String          @unique
  password      String          // bcrypt hashed
  name          String
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  searchHistory SearchHistory[]
}
```

### SearchHistory Model
```prisma
model SearchHistory {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  userId       String?  @db.ObjectId        // null for guest users
  businessIdea String
  aiAnalysis   Json                         // Full AI response
  sessionId    String?                      // For guest tracking
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User?    @relation(fields: [userId], references: [id])
}
```

## 🛠️ Development Commands

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset database (development only)

# Development
npm run dev            # Start both servers
npm run server         # Start backend only
npm run client         # Start frontend only

# Production
npm run start          # Start production server
npm run build          # Build for production
```

## 🌟 Production Considerations

For production deployment, consider:

### Security Enhancements:
- Use strong, unique JWT secrets (32+ characters)
- Enable HTTPS and secure cookies
- Implement rate limiting
- Add input sanitization
- Use environment-specific configurations

### Performance Optimizations:
- Enable MongoDB connection pooling
- Implement response caching
- Add request compression
- Optimize Prisma queries
- Use CDN for static assets

### Monitoring & Logging:
- Add structured logging
- Implement error tracking (Sentry)
- Monitor API performance
- Set up health checks
- Database monitoring

### Scalability:
- Horizontal scaling with load balancers
- Database indexing optimization
- Caching layer (Redis)
- Background job processing
- Microservices architecture

## 📝 License

This is a demo project for educational and competition purposes.

## 🤝 Contributing

This is a demo MVP. For production use, consider the security and performance enhancements mentioned above.

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Verify MongoDB Atlas connection string
   - Check network access and IP whitelist
   - Ensure database user has proper permissions

2. **Prisma Client Issues**
   - Run `npm run db:generate` after schema changes
   - Delete `node_modules/@prisma/client` and regenerate

3. **Authentication Errors**
   - Verify JWT_SECRET is set and consistent
   - Check token format in Authorization header
   - Ensure user exists in database

4. **AI Analysis Failures**
   - Verify GEMINI_API_KEY is valid and active
   - Check API quota and rate limits
   - Review business idea length (max 1000 chars)

### Debug Mode:
Set `NODE_ENV=development` for detailed error messages and logging.

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Test individual API endpoints with tools like Postman
4. Verify environment variables are properly set