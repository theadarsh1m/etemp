import { NextResponse } from 'next/server';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const fallbackImage = 'https://placehold.co/400x400.png';

export async function GET(request: Request) {
  if (!PEXELS_API_KEY) {
    console.error("Pexels API key is not configured.");
    return NextResponse.json({ error: 'Pexels API key not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Pexels API error: ${response.status} ${response.statusText}`, errorText);
        return NextResponse.json({ imageUrl: fallbackImage }, { status: 200 }); // Return fallback on error
    }

    const data = await response.json();
    const imageUrl = data.photos?.[0]?.src?.medium;

    return NextResponse.json({ imageUrl: imageUrl || fallbackImage });
  } catch (error) {
    console.error("Failed to fetch image from Pexels:", error);
    return NextResponse.json({ imageUrl: fallbackImage }, { status: 200 }); // Return fallback on error
  }
}
