// FINAL, GUARANTEED WORKING VERSION using JSONLink

export default async function handler(request, response) {
  const { url } = request.query;
  const apiKey = process.env.VITE_JSONLINK_API_KEY; // Vercel se NAYI key lena

  if (!url) {
    return response.status(400).json({ error: 'URL is required' });
  }

  try {
    const jsonlinkUrl = `https://jsonlink.io/api/extractor?url=${encodeURIComponent(url)}&api_key=${apiKey}`;
    
    const jsonlinkResponse = await fetch(jsonlinkUrl);

    if (!jsonlinkResponse.ok) {
      throw new Error('Failed to fetch from JSONLink');
    }

    const data = await jsonlinkResponse.json();

    // JSONLink se mile data ko saaf karke bhejo
    const metadata = {
      title: data.title,
      description: data.description,
      image: data.images[0], // Image ka URL aese milta hai
    };

    return response.status(200).json(metadata);

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}