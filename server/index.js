const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// System prompt for Gemini
const SYSTEM_PROMPT = `You are an AI assistant helping Indian first-time entrepreneurs understand business compliance requirements.

Your task is to analyze a business idea and return ONLY structured JSON in the exact format specified below.

IMPORTANT RULES:
- Do not provide legal guarantees or advice
- Base your response on Indian business context and regulations
- If unsure about any requirement, mark confidence as Medium or Low
- Return ONLY valid JSON, no explanation text
- Focus on pre-compliance guidance, not filing applications

Required JSON format:
{
  "business_summary": {
    "business_type": "brief category description",
    "state": "inferred or ask user to specify",
    "scale": "Small/Medium/Large based on description"
  },
  "licenses": [
    {
      "name": "License/Registration name",
      "status": "Required | Conditional | Optional",
      "why_applies": "Brief explanation why this applies",
      "source": "Issuing authority",
      "confidence": "High | Medium | Low"
    }
  ],
  "roadmap": [
    {
      "step": 1,
      "action": "First action to take",
      "description": "Brief description of what this involves"
    }
  ],
  "schemes": [
    {
      "name": "Scheme/Programme name",
      "type": "Government | Private",
      "why_relevant": "Why this scheme applies to the business",
      "source": "Implementing agency"
    }
  ],
  "next_action": "Most immediate action the entrepreneur should take"
}`;

// Analyze business idea endpoint
app.post('/analyze-idea', async (req, res) => {
  try {
    const { idea } = req.body;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Business idea is required' });
    }

    // Use Gemini 2.5 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Create the full prompt
    const fullPrompt = `${SYSTEM_PROMPT}

Business Idea to Analyze: "${idea}"

Return only the JSON response:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    let text = response.text();

    // Clean up the response to extract JSON
    text = text.trim();
    
    // Remove markdown code blocks if present
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Parse JSON
    let analysisResult;
    try {
      analysisResult = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      
      // Fallback response if JSON parsing fails
      analysisResult = {
        business_summary: {
          business_type: "General Business",
          state: "Please specify your state",
          scale: "Small"
        },
        licenses: [
          {
            name: "GST Registration",
            status: "Conditional",
            why_applies: "Required if annual turnover exceeds ₹20 lakhs",
            source: "GST Department",
            confidence: "High"
          }
        ],
        roadmap: [
          {
            step: 1,
            action: "Define your business model clearly",
            description: "Create a detailed business plan with target market analysis"
          },
          {
            step: 2,
            action: "Research specific compliance requirements",
            description: "Consult with local authorities for state-specific requirements"
          }
        ],
        schemes: [
          {
            name: "MUDRA Loan",
            type: "Government",
            why_relevant: "Provides funding for micro and small enterprises",
            source: "Ministry of Finance"
          }
        ],
        next_action: "Please provide more specific details about your business idea and location"
      };
    }

    // Validate required fields
    if (!analysisResult.business_summary || !analysisResult.licenses || !analysisResult.roadmap) {
      throw new Error('Invalid response structure from AI');
    }

    // Add metadata
    analysisResult._metadata = {
      model_used: 'gemini-2.5-flash',
      timestamp: new Date().toISOString()
    };

    res.json(analysisResult);

  } catch (error) {
    console.error('Error analyzing business idea:', error);
    res.status(500).json({ 
      error: 'Failed to analyze business idea',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// List available models endpoint for debugging
app.get('/list-models', async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json({ models: models });
  } catch (error) {
    console.error('Error listing models:', error);
    res.status(500).json({ error: 'Failed to list models', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});