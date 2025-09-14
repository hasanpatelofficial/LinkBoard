import { gotScraping } from 'got-scraping'; // Nayi powerful library
import cheerio from 'cheerio';

export default async function handler(request, response) {
  const { url } = request.query;

  if (!url) {
    return response.status(400).json({ error: 'URL parameter is required.' });
  }

  try {
    // 1. Ab hum 'gotScraping' ka istemal karenge jo bot detection ko bypass karta hai
    const scrapedResponse = await gotScraping({
      url: url,
      headerGeneratorOptions: {
        browsers: [{ name: 'chrome' }], // Yeh real browser ki tarah behave karega
        operatingSystems: [{ name: 'windows' }],
      },
    });

    const html = scrapedResponse.body;
    const $ = cheerio.load(html);

    // 2. Metadata extract karna bilkul same rahega
    const getMetaTag = (name) => {
      return (
        $(`meta[property="og:${name}"]`).attr('content') ||
        $(`meta[name="${name}"]`).attr('content')
      );
    };

    const metadata = {
      title: $('title').first().text() || getMetaTag('title'),
      description: getMetaTag('description'),
      image: getMetaTag('image'),
    };
    
    // 3. Metadata wapas bhejo
    return response.status(200).json(metadata);

  } catch (error) {
    console.error(error); // Error ko server par log karo
    return response.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}