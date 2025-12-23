# StartupSaarthi - AI Co-Pilot for Indian Entrepreneurs

A demo-grade MVP that helps Indian entrepreneurs understand business compliance requirements using AI.

## 🎯 What it does

StartupSaarthi analyzes your business idea and provides:
- **Business Overview** - Categorizes your business type and scale
- **Licenses Checklist** - Required, conditional, and optional licenses
- **Step-by-Step Roadmap** - Clear actions to take in order
- **Government Schemes** - Relevant funding and support programs
- **Next Action** - Immediate next step to focus on

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express
- **AI**: Google Gemini 1.5 Flash API
- **Styling**: Vanilla CSS (no external UI library)

## 📁 Project Structure

```
startupsaarthi-mvp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx    # Landing page with input
│   │   │   └── Dashboard.jsx # Results display
│   │   ├── services/
│   │   │   └── api.js      # API calls
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   ├── package.json
│   └── .env.example       # Environment variables template
├── package.json           # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
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

Edit `server/.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
```

3. **Start the development servers:**
```bash
# From root directory
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:3000

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

## 🧪 Testing the Demo

1. Open http://localhost:3000
2. Enter a business idea like: "I want to start a cloud kitchen in Assam"
3. Click "Get Guidance"
4. View the AI-generated analysis on the dashboard

### Sample Test Cases

Try these business ideas:
- "Cloud kitchen serving traditional Assamese cuisine in Guwahati"
- "E-commerce platform for handmade crafts in Maharashtra"
- "Digital marketing agency in Bangalore"
- "Organic farming business in Punjab"

## 🔧 API Endpoints

### POST /analyze-idea
Analyzes a business idea using Gemini AI.

**Request:**
```json
{
  "idea": "I want to start a cloud kitchen in Assam"
}
```

**Response:**
```json
{
  "business_summary": {
    "business_type": "Food Service Business",
    "state": "Assam",
    "scale": "Small"
  },
  "licenses": [
    {
      "name": "FSSAI License",
      "status": "Required",
      "why_applies": "Mandatory for all food businesses",
      "source": "Food Safety and Standards Authority of India",
      "confidence": "High"
    }
  ],
  "roadmap": [
    {
      "step": 1,
      "action": "Obtain FSSAI Registration",
      "description": "Apply for basic FSSAI license for food business"
    }
  ],
  "schemes": [
    {
      "name": "PMEGP",
      "type": "Government",
      "why_relevant": "Provides funding for micro enterprises",
      "source": "Ministry of MSME"
    }
  ],
  "next_action": "Start with FSSAI license application"
}
```

### GET /health
Health check endpoint.

## 🎨 UI Features

- **Clean, minimal design** - Focus on usability over aesthetics
- **Responsive layout** - Works on desktop and mobile
- **Loading states** - Clear feedback during AI processing
- **Error handling** - User-friendly error messages
- **Status indicators** - Color-coded license requirements
- **Confidence levels** - Shows AI confidence in recommendations

## 🔒 Important Notes

### This is a DEMO MVP
- **Not for production use**
- **No user authentication**
- **No data persistence**
- **No legal guarantees**

### AI Limitations
- Responses are guidance only, not legal advice
- Confidence levels indicate AI uncertainty
- Always verify with official sources
- Requirements may vary by location and circumstances

### Gemini API Usage
- Uses structured prompts to force JSON responses
- Includes fallback handling for parsing errors
- Implements retry logic for API failures

## 🛠️ Development

### Adding New Features
1. Backend changes go in `server/index.js`
2. Frontend components go in `client/src/components/`
3. API calls are centralized in `client/src/services/api.js`

### Customizing AI Responses
Edit the `SYSTEM_PROMPT` in `server/index.js` to modify AI behavior.

### Styling
All styles are in `client/src/index.css` using vanilla CSS for simplicity.

## 📝 License

This is a demo project for educational purposes.

## 🤝 Contributing

This is a demo MVP. For production use, consider:
- Adding user authentication
- Implementing data persistence
- Adding comprehensive error handling
- Including automated tests
- Implementing rate limiting
- Adding input validation and sanitization