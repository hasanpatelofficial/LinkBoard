// This is our FINAL, simplified Vercel Serverless Function
import { getLinkPreview } from 'link-preview-js';

export default async function handler(request, response) {
  // 1. Get the URL from the query parameter
  const { url } = request.query;

  if (!url) {
    return response.status(400).json({ error: 'URL parameter is required.' });
  }

  try {
    // 2. Use the new library to get the preview
    const data = await getLinkPreview(url);

    // 3. Extract the required metadata
    const metadata = {
      title: data.title,
      description: data.description,
      image: data.images[0], // Get the first image
    };
    
    // 4. Send the metadata back to our React app
    return response.status(200).json(metadata);

  } catch (error) {
    return response.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}