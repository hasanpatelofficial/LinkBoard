// FINAL WORKING VERSION
import cheerio from 'cheerio';

export default async function handler(request, response) {
  // 1. Get the URL from the query parameter
  const urlToScrape = request.query.url;

  if (!urlToScrape) {
    return response.status(400).json({ error: 'URL parameter is required.' });
  }

  try {
    // 2. Fetch the HTML of the target website
    const res = await fetch(urlToScrape, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch the page, status: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // 3. Extract metadata using Cheerio
    const getMetaTag = (name) => {
      return (
        $(`meta[property="og:${name}"]`).attr('content') ||
        $(`meta[name="${name}"]`).attr('content') ||
        '' // Return empty string if not found
      );
    };

    const metadata = {
      title: $('title').first().text() || getMetaTag('title'),
      description: getMetaTag('description'),
      image: getMetaTag('image'),
    };
    
    // 4. Send the metadata back to our React app
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 1 day
    return response.status(200).json(metadata);

  } catch (error) {
    return response.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}