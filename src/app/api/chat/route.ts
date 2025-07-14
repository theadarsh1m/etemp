import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    // Validate input
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid query provided" },
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

    // Sanitize the input
    const sanitizedQuery = query.trim().slice(0, 1000);

    // Make request to Gemini API
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
                  text: `You are a fashion stylist AI helping users find clothing and outfit suggestions based on their preferences, mood, and occasion.

Your job is to:
- Understand user inputs like "I want something for college", "I feel lazy today", or "I like black"
- Immediately respond with specific outfit ideas or items (not more questions)
- Always suggest 2–3 outfit ideas with:
    - Top
    - Bottom
    - Footwear
    - Accessories (optional)
    - Color/style reasoning

✅ Sample Output Format:
👗 Outfit 1 – Chill College Vibe:
- Top: Oversized white hoodie
- Bottom: Black joggers
- Shoes: White sneakers
- Why: Comfortable and casual, perfect for laid-back days.

👗 Outfit 2 – Sleek & Minimal:
- Top: Slim black t-shirt
- Bottom: Beige chinos
- Shoes: Loafers or clean canvas shoes
- Why: This balances a dark color with a lighter tone for a clean look.

IMPORTANT: Keep replies short, direct, and focused on clothing suggestions. Don't ask too many follow-up questions unless really needed.

Customer Query: ${sanitizedQuery}`,
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
          response:
            "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or ask me about specific product categories like 'casual wear', 'workout clothes', or 'formal attire'.",
        },
        { status: 200 }, // Return 200 with fallback message
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return NextResponse.json({
        response:
          "I'm having trouble generating suggestions right now. Could you try asking about specific clothing items like 'what should I wear to a casual dinner' or 'suggest an outfit for work'?",
      });
    }

    return NextResponse.json({
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({
      response:
        "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
    });
  }
}
