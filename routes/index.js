const express = require('express');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/headlines', async (req, res) => {
  try {
    console.log('Fetching headlines...');
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://www.theverge.com');
    const html = await response.text();
    const $ = cheerio.load(html);
    const headlines = [];
    $('.max-w-content-block-standard, .max-w-content-block-mobile').each((index, element) => {
      const titleElement = $(element).find('h2 a');
      const title = titleElement.text();
      const relativeUrl = titleElement.attr('href');
      const absoluteUrl = `https://www.theverge.com${relativeUrl}`;
      const dateString = $(element).find('time').attr('datetime');
      const date = new Date(dateString);
      headlines.push({ title, url: absoluteUrl, date });
    });
    headlines.sort((a, b) => b.date - a.date);
    res.render('index', { title: 'Headlines', headlines });
  } catch (error) {
    console.error('Error fetching headlines:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
