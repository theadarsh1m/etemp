import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if the API key exists
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    // Make a simple test request to Gemini API
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
                  text: 'Hello, this is a test. Please respond with "API key is working correctly".',
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Gemini API error: ${response.status} - ${errorText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: "Gemini API key is working correctly",
      response:
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text",
    });
  } catch (error) {
    console.error("Error testing Gemini API:", error);
    return NextResponse.json(
      {
        error: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
