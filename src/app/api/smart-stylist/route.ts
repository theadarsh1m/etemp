import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { photoDataUri, description, type } = await request.json();

    // Validate input
    if (
      type === "image" &&
      (!photoDataUri || typeof photoDataUri !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid photo data provided" },
        { status: 400 },
      );
    }

    if (type === "text" && (!description || typeof description !== "string")) {
      return NextResponse.json(
        { error: "Invalid description provided" },
        { status: 400 },
      );
    }

    // Check if the API key exists
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    let requestBody;

    if (type === "image") {
      // Validate data URI format
      if (
        !photoDataUri.startsWith("data:") ||
        !photoDataUri.includes("base64,")
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid photo format. Please provide a base64 encoded image.",
          },
          { status: 400 },
        );
      }

      // Extract base64 data and mime type
      const [mimeType, base64Data] = photoDataUri
        .replace("data:", "")
        .split(";base64,");

      requestBody = {
        contents: [
          {
            parts: [
              {
                text: `You are an expert fashion stylist and computer vision specialist. Analyze this fashion item image and provide detailed styling recommendations.

**Your Task:**
1. Use computer vision to detect and identify:
   - Primary and secondary colors
   - Item category (kurti, shirt, dress, pants, skirt, etc.)
   - Style classification (casual, formal, ethnic, boho, minimalist, etc.)
   - Fabric type if visible (cotton, silk, denim, linen, etc.)
   - Design elements (embroidery, patterns, cuts, etc.)

2. Based on your analysis, suggest 3-4 matching accessories and complementary clothing items following these rules:
   - Match by style consistency (ethnic → traditional accessories, casual → modern pieces)
   - Apply color theory (complementary colors, analogous schemes, neutral pairings)
   - Ensure seasonal and occasion appropriateness
   - Consider gender styling preferences and cultural context

3. Provide a cohesive color palette that works with the main item

**Response Format (JSON only):**
{
  "mainItem": {
    "name": "Detailed item description",
    "color": "Primary color",
    "category": "Item category",
    "style": "Style classification",
    "fabric": "Fabric type if identifiable"
  },
  "complementary": [
    {
      "item": "Specific accessory/clothing name",
      "reason": "Why this pairs well",
      "category": "accessories/tops/bottoms/footwear"
    }
  ],
  "colorPalette": ["color1", "color2", "color3"],
  "styleNotes": "Overall styling advice and outfit combination tips",
  "confidence": 0.85
}

Analyze the image and provide styling recommendations:`,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
      };
    } else {
      // Text-based analysis
      requestBody = {
        contents: [
          {
            parts: [
              {
                text: `You are an expert fashion stylist. Based on this text description of a fashion item, provide detailed styling recommendations.

**Item Description:** "${description}"

**Your Task:**
1. Analyze the described item to identify:
   - Colors mentioned or implied
   - Item category and style
   - Fabric type if mentioned
   - Occasion or style context

2. Suggest 3-4 matching accessories and complementary clothing items following these rules:
   - Match by style consistency (ethnic → traditional accessories, casual → modern pieces)
   - Apply color theory principles
   - Ensure seasonal and occasion appropriateness
   - Consider cultural context if applicable

3. Provide a cohesive color palette that works with the described item

**Response Format (JSON only):**
{
  "mainItem": {
    "name": "Refined item description based on input",
    "color": "Primary color",
    "category": "Item category",
    "style": "Style classification",
    "fabric": "Fabric type if mentioned"
  },
  "complementary": [
    {
      "item": "Specific accessory/clothing name",
      "reason": "Why this pairs well",
      "category": "accessories/tops/bottoms/footwear"
    }
  ],
  "colorPalette": ["color1", "color2", "color3"],
  "styleNotes": "Overall styling advice and outfit combination tips",
  "confidence": 0.80
}

Provide styling recommendations based on the description:`,
              },
            ],
          },
        ],
      };
    }

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        {
          error:
            "I'm having trouble analyzing the item right now. Please try again in a moment.",
        },
        { status: 500 },
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return NextResponse.json(
        {
          error:
            "I'm having trouble generating style recommendations right now. Please try again.",
        },
        { status: 500 },
      );
    }

    // Clean the response by removing markdown code blocks
    let cleanedResponse = aiResponse.trim();

    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(cleanedResponse);

      // Validate the response structure
      if (
        !parsed.mainItem ||
        !parsed.complementary ||
        !Array.isArray(parsed.complementary)
      ) {
        throw new Error("Invalid response structure");
      }

      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);

      // Return a fallback response
      return NextResponse.json({
        mainItem: {
          name: type === "text" ? description : "Fashion Item",
          color: "Multi-colored",
          category: "Clothing",
          style: "Versatile",
          fabric: "Mixed materials",
        },
        complementary: [
          {
            item: "Classic neutral accessories",
            reason: "Versatile pieces that complement most styles",
            category: "accessories",
          },
          {
            item: "Comfortable neutral footwear",
            reason: "Pairs well with various outfit combinations",
            category: "footwear",
          },
          {
            item: "Layering pieces in complementary colors",
            reason: "Adds depth and style flexibility",
            category: "tops",
          },
        ],
        colorPalette: ["Neutral", "Earth tones", "Classic"],
        styleNotes:
          "This item offers great versatility. Focus on building a capsule wardrobe with complementary neutral pieces that can be mixed and matched. Add personality through accessories and consider the occasion when styling.",
        confidence: 0.7,
      });
    }
  } catch (error) {
    console.error("Error in smart stylist API:", error);
    return NextResponse.json(
      {
        error:
          "I'm experiencing some technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
