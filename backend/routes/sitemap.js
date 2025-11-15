const express = require('express');
const router = express.Router();

// Sitemap route - generates XML sitemap for search engines
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://diagonalsewa.com';
  
  // Define all pages with priority and change frequency
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/design-construction', priority: '0.9', changefreq: 'weekly' },
    { url: '/repair-maintenance', priority: '0.9', changefreq: 'weekly' },
    { url: '/gallery', priority: '0.8', changefreq: 'weekly' },
    { url: '/portfolio', priority: '0.8', changefreq: 'weekly' },
    { url: '/about-team', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' }
  ];

  // Generate current date for lastmod
  const currentDate = new Date().toISOString().split('T')[0];

  // Build XML sitemap
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  // Set headers for XML response
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;
