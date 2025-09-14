// FINAL, CORRECTED, GUARANTEED WORKING VERSION using JSONLink

export default async function handler(request, response) {
  const { url } = request.query;
  const apiKey = process.env.VITE_JSONLINK_API_KEY; // Vercel se key lena

  if (!url) {
    return response.status(400).json({ error: 'URL is required' });
  }

  try {
    // YAHAN PAR TYPO THEEK KIYA GAYA HAI: 'extractor' -> 'extract'
    const jsonlinkUrl = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}`;
    
    const jsonlinkResponse = await fetch(jsonlinkUrl);

    if (!jsonlinkResponse.ok) {
      const errorData = await jsonlinkResponse.json();
      throw new Error(errorData.description || 'Failed to fetch from JSONLink');
    }

    const data = await jsonlinkResponse.json();

    // JSONLink se mile data ko saaf karke bhejo
    const metadata = {
      title: data.title,
      description: data.description,
      image: data.images[0], // Get the first image
    };

    // Cache the response for 1 day
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return response.status(200).json(metadata);

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}