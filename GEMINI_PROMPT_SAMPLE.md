# Sample Gemini Prompt for StartupSaarthi

This document shows the exact prompt structure used to get structured responses from Gemini API.

## System Prompt (Used in server/index.js)

```
You are an AI assistant helping Indian first-time entrepreneurs understand business compliance requirements.

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
}
```

## Sample Input/Output

### Input:
```
Business Idea to Analyze: "I want to start a cloud kitchen in Assam."
```

### Expected Output:
```json
{
  "business_summary": {
    "business_type": "Food Service Business - Cloud Kitchen",
    "state": "Assam",
    "scale": "Small"
  },
  "licenses": [
    {
      "name": "FSSAI License",
      "status": "Required",
      "why_applies": "Mandatory for all food businesses in India",
      "source": "Food Safety and Standards Authority of India",
      "confidence": "High"
    },
    {
      "name": "GST Registration",
      "status": "Conditional",
      "why_applies": "Required if annual turnover exceeds ₹20 lakhs",
      "source": "GST Department",
      "confidence": "High"
    },
    {
      "name": "Trade License",
      "status": "Required",
      "why_applies": "Required by local municipal corporation for commercial activity",
      "source": "Local Municipal Corporation",
      "confidence": "High"
    },
    {
      "name": "Fire Safety Certificate",
      "status": "Required",
      "why_applies": "Mandatory for commercial kitchens",
      "source": "Fire Department",
      "confidence": "Medium"
    }
  ],
  "roadmap": [
    {
      "step": 1,
      "action": "Obtain FSSAI Basic License",
      "description": "Apply online for FSSAI basic license for food business with annual turnover up to ₹12 lakhs"
    },
    {
      "step": 2,
      "action": "Get Trade License",
      "description": "Apply to local municipal corporation for trade license to operate commercial kitchen"
    },
    {
      "step": 3,
      "action": "Fire Safety Clearance",
      "description": "Get fire safety certificate from local fire department for kitchen operations"
    },
    {
      "step": 4,
      "action": "Setup Business Structure",
      "description": "Register as proprietorship, partnership, or private limited company based on scale"
    },
    {
      "step": 5,
      "action": "GST Registration (if applicable)",
      "description": "Register for GST if planning annual turnover above ₹20 lakhs"
    }
  ],
  "schemes": [
    {
      "name": "PMEGP (Prime Minister's Employment Generation Programme)",
      "type": "Government",
      "why_relevant": "Provides funding up to ₹25 lakhs for food processing units",
      "source": "Ministry of MSME"
    },
    {
      "name": "MUDRA Loan",
      "type": "Government",
      "why_relevant": "Provides collateral-free loans up to ₹10 lakhs for micro enterprises",
      "source": "Ministry of Finance"
    },
    {
      "name": "Assam Startup Policy",
      "type": "Government",
      "why_relevant": "State-specific incentives and support for startups in Assam",
      "source": "Government of Assam"
    }
  ],
  "next_action": "Start with FSSAI license application as it's the foundational requirement for any food business"
}
```

## Key Prompt Engineering Techniques Used

1. **Strict JSON Format**: Forces structured output
2. **Confidence Levels**: Handles AI uncertainty
3. **Indian Context**: Focuses on local regulations
4. **Status Categories**: Clear requirement classification
5. **Step-by-Step**: Logical progression for users
6. **Disclaimer Integration**: Avoids legal liability

## Testing Different Business Ideas

The prompt should work well for various business types:
- Food businesses (restaurants, cloud kitchens)
- E-commerce platforms
- Service businesses (consulting, agencies)
- Manufacturing units
- Retail stores
- Technology startups

Each will get relevant licenses, schemes, and roadmaps based on the business type and location mentioned.