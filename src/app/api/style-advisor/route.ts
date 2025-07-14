import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { photoDataUri } = await request.json();

    // Validate input
    if (!photoDataUri || typeof photoDataUri !== "string") {
      return NextResponse.json(
        { error: "Invalid photo data provided" },
        { status: 400 },
      );
    }

    // Validate data URI format
    if (
      !photoDataUri.startsWith("data:") ||
      !photoDataUri.includes("base64,")
    ) {
      return NextResponse.json(
        {
          error: "Invalid photo format. Please provide a base64 encoded image.",
        },
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

    // Extract base64 data and mime type
    const [mimeType, base64Data] = photoDataUri
      .replace("data:", "")
      .split(";base64,");

    // Make request to Gemini API with vision
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert fashion stylist. Analyze this photo of a person and provide personalized fashion advice.

Please analyze the person's facial features and provide:

1. **Facial Analysis**:
   - Gender (Male, Female, or Non-binary)
   - Estimated Age (e.g., 20-25)
   - Face Shape (Oval, Round, Square, Heart)
   - Dominant Mood/Emotion (Happy, Neutral, Thoughtful)

2. **Style Advice**: Based on your analysis, provide concise fashion advice. Suggest styles, colors, and types of clothing or accessories that would complement the user's features.

3. **Product Tags**: Provide 3-5 product tags for filtering relevant items. Choose from: "men", "women", "unisex", "outerwear", "pants", "shoes", "casual", "accessories", "tops", "basics", "gaming", "fitness", "summer", "winter", "leather", "denim", "sports".

Please respond in this exact JSON format:
{
  "facialAnalysis": {
    "gender": "...",
    "age": "...",
    "faceShape": "...",
    "mood": "..."
  },
  "styleAdvice": "...",
  "recommendedProductTags": ["tag1", "tag2", "tag3"]
}`,
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
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        {
          error:
            "I'm having trouble analyzing the photo right now. Please try again in a moment or try with a different photo.",
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
            "I'm having trouble generating style advice right now. Please try again with a clear photo of your face.",
        },
        { status: 500 },
      );
    }

    // Clean the response by removing markdown code blocks
    let cleanedResponse = aiResponse.trim();

    // Remove ```json and ``` if present
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
      return NextResponse.json(parsed);
    } catch (parseError) {
      // If JSON parsing fails, return a fallback response
      return NextResponse.json({
        facialAnalysis: {
          gender: "Not detected",
          age: "Not detected",
          faceShape: "Not detected",
          mood: "Not detected",
        },
        styleAdvice:
          aiResponse ||
          "I can see you in the photo! Based on what I observe, I'd suggest trying versatile pieces that can be mixed and matched easily. Consider classic colors like navy, white, and beige as your foundation, then add personality with accessories or statement pieces.",
        recommendedProductTags: ["casual", "basics", "unisex"],
      });
    }
  } catch (error) {
    console.error("Error in style advisor API:", error);
    return NextResponse.json(
      {
        error:
          "I'm experiencing some technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
