const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  getSystemPrompt() {
    return `You are an AI assistant specialized in analyzing business ideas for Indian entrepreneurs. 

Your task is to analyze a business idea and return ONLY structured JSON in the exact format specified below.

IMPORTANT RULES:
- Focus on Indian business context, regulations, and market conditions
- Provide realistic assessments based on current market trends
- Include specific Indian compliance requirements
- Return ONLY valid JSON, no explanation text
- If unsure about any aspect, indicate lower confidence scores

Required JSON format:
{
  "viabilityScore": {
    "overall": 75,
    "market": 80,
    "financial": 70,
    "regulatory": 85,
    "explanation": "Brief explanation of the overall viability"
  },
  "targetAudience": {
    "primary": "Primary target demographic",
    "secondary": "Secondary target demographic", 
    "marketSize": "Estimated market size in India",
    "demographics": ["demographic1", "demographic2"]
  },
  "competitorLandscape": {
    "directCompetitors": ["competitor1", "competitor2"],
    "indirectCompetitors": ["competitor1", "competitor2"],
    "marketGap": "Identified market opportunity or gap",
    "competitiveAdvantage": "Potential competitive advantages"
  },
  "mandatoryLicenses": [
    {
      "name": "License/Registration name",
      "authority": "Issuing authority",
      "timeline": "Expected processing time",
      "cost": "Approximate cost range",
      "priority": "High | Medium | Low",
      "description": "What this license covers"
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Foundation",
      "duration": "1-2 months",
      "tasks": ["task1", "task2", "task3"],
      "milestones": ["milestone1", "milestone2"],
      "estimatedCost": "Cost range for this phase"
    }
  ],
  "financialProjection": {
    "initialInvestment": "Estimated startup capital needed",
    "monthlyOperatingCost": "Estimated monthly expenses",
    "breakEvenTimeline": "Expected time to break even",
    "revenueStreams": ["stream1", "stream2"]
  },
  "riskAssessment": {
    "high": ["high risk factor 1", "high risk factor 2"],
    "medium": ["medium risk factor 1"],
    "low": ["low risk factor 1"],
    "mitigation": "Key risk mitigation strategies"
  },
  "governmentSchemes": [
    {
      "name": "Scheme name",
      "type": "Government | Private",
      "eligibility": "Eligibility criteria",
      "benefits": "What benefits it provides",
      "applicationProcess": "How to apply"
    }
  ],
  "nextSteps": {
    "immediate": "Most urgent action to take",
    "shortTerm": "Actions for next 1-3 months", 
    "longTerm": "Strategic actions for 6+ months"
  }
}`;
  }

  async analyzeBusinessIdea(businessIdea) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const prompt = `${this.getSystemPrompt()}

Business Idea to Analyze: "${businessIdea}"

Analyze this business idea in the Indian market context and return the structured JSON response:`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();

      // Clean up response
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
        
        // Fallback response
        analysisResult = this.getFallbackResponse(businessIdea);
      }

      // Validate and add metadata
      analysisResult = this.validateAndEnhanceResponse(analysisResult, businessIdea);
      
      return analysisResult;

    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(businessIdea);
    }
  }

  getFallbackResponse(businessIdea) {
    return {
      viabilityScore: {
        overall: 60,
        market: 65,
        financial: 55,
        regulatory: 60,
        explanation: "Analysis requires more specific information about the business model and target market."
      },
      targetAudience: {
        primary: "General consumers",
        secondary: "Small businesses",
        marketSize: "To be determined based on specific market research",
        demographics: ["Urban middle class", "Tech-savvy consumers"]
      },
      competitorLandscape: {
        directCompetitors: ["To be identified through market research"],
        indirectCompetitors: ["Traditional alternatives"],
        marketGap: "Requires detailed market analysis",
        competitiveAdvantage: "To be defined based on unique value proposition"
      },
      mandatoryLicenses: [
        {
          name: "Business Registration",
          authority: "Registrar of Companies / Local Authority",
          timeline: "15-30 days",
          cost: "₹5,000 - ₹25,000",
          priority: "High",
          description: "Basic business entity registration"
        },
        {
          name: "GST Registration",
          authority: "GST Department",
          timeline: "7-15 days",
          cost: "Free (if eligible)",
          priority: "High",
          description: "Goods and Services Tax registration if turnover exceeds threshold"
        }
      ],
      roadmap: [
        {
          phase: "Phase 1: Planning & Research",
          duration: "1-2 months",
          tasks: ["Market research", "Business plan development", "Legal structure setup"],
          milestones: ["Completed market analysis", "Finalized business model"],
          estimatedCost: "₹50,000 - ₹1,00,000"
        },
        {
          phase: "Phase 2: Setup & Launch",
          duration: "2-3 months", 
          tasks: ["Obtain licenses", "Setup operations", "Initial marketing"],
          milestones: ["All licenses obtained", "Operations ready"],
          estimatedCost: "₹2,00,000 - ₹5,00,000"
        }
      ],
      financialProjection: {
        initialInvestment: "₹2,00,000 - ₹10,00,000",
        monthlyOperatingCost: "₹50,000 - ₹2,00,000",
        breakEvenTimeline: "12-18 months",
        revenueStreams: ["Primary service/product sales", "Secondary revenue streams"]
      },
      riskAssessment: {
        high: ["Market competition", "Regulatory changes"],
        medium: ["Economic fluctuations", "Technology disruption"],
        low: ["Seasonal variations"],
        mitigation: "Diversify revenue streams, maintain regulatory compliance, continuous market monitoring"
      },
      governmentSchemes: [
        {
          name: "MUDRA Loan",
          type: "Government",
          eligibility: "Micro and small enterprises",
          benefits: "Collateral-free loans up to ₹10 lakhs",
          applicationProcess: "Apply through participating banks"
        },
        {
          name: "Startup India",
          type: "Government", 
          eligibility: "Innovative startups",
          benefits: "Tax exemptions, easier compliance, funding opportunities",
          applicationProcess: "Register on Startup India portal"
        }
      ],
      nextSteps: {
        immediate: "Conduct detailed market research and validate the business concept",
        shortTerm: "Develop a comprehensive business plan and identify funding sources",
        longTerm: "Build a strong team and establish market presence"
      },
      _metadata: {
        model: "gemini-2.5-flash",
        timestamp: new Date().toISOString(),
        fallback: true
      }
    };
  }

  validateAndEnhanceResponse(response, businessIdea) {
    // Add metadata
    response._metadata = {
      model: "gemini-2.5-flash",
      timestamp: new Date().toISOString(),
      businessIdea: businessIdea,
      fallback: false
    };

    // Validate required fields and provide defaults if missing
    if (!response.viabilityScore) {
      response.viabilityScore = { overall: 50, market: 50, financial: 50, regulatory: 50, explanation: "Insufficient data for detailed analysis" };
    }

    if (!response.targetAudience) {
      response.targetAudience = { primary: "To be determined", secondary: "To be determined", marketSize: "Unknown", demographics: [] };
    }

    if (!response.mandatoryLicenses || !Array.isArray(response.mandatoryLicenses)) {
      response.mandatoryLicenses = [];
    }

    if (!response.roadmap || !Array.isArray(response.roadmap)) {
      response.roadmap = [];
    }

    return response;
  }
}

module.exports = new AIService();