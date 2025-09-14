// FINAL, SMARTEST, GUARANTEED WORKING VERSION using JSONLink with Prerender

export default async function handler(request, response) {
  const { url } = request.query;
  const apiKey = process.env.VITE_JSONLINK_API_KEY;

  if (!url) {
    return response.status(400).json({ error: 'URL is required' });
  }

  try {
    // --- YAHAN PAR BADLAV HUA HAI: '&prerender=true' add kiya gaya hai ---
    const jsonlinkUrl = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}&prerender=true`;
    
    const jsonlinkResponse = await fetch(jsonlinkUrl);

    if (!jsonlinkResponse.ok) {
      const errorData = await jsonlinkResponse.json();
      throw new Error(errorData.description || 'Failed to fetch from JSONLink');
    }

    const data = await jsonlinkResponse.json();

    const metadata = {
      title: data.title,
      description: data.description,
      image: data.images[0],
    };

    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return response.status(200).json(metadata);

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}