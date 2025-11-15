import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = 'Diagonal Group | Construction & 3D Design Services Nepal',
  description = 'Professional 3D design, corporate housing development, apartment construction, and repair services in Kathmandu, Nepal. 14+ years of excellence.',
  keywords = 'construction company Nepal, 3D design Kathmandu, corporate housing, apartment construction, house construction Nepal, repair maintenance, commercial building',
  ogImage = 'https://diagonalsewa.com/images/gallery/hero.jpg',
  canonical = '',
  schemaMarkup = null,
  noIndex = false
}) => {
  const siteUrl = 'https://diagonalsewa.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  // Default Organization Schema
  const defaultOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Diagonal Group',
    alternateName: 'Diagonal Enterprises',
    url: 'https://diagonalsewa.com',
    logo: 'https://diagonalsewa.com/logo.png',
    description: 'Leading construction and 3D design company in Nepal specializing in corporate housing, apartments, and commercial projects',
    foundingDate: '2010',
    email: 'info@diagonal.com',
    telephone: '+977-9801890011',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP'
    },
    sameAs: [
      'https://www.instagram.com/diagonalgroup/',
      'https://www.facebook.com/search/top?q=diagonal%20group'
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Nepal'
    }
  };

  // Default LocalBusiness Schema
  const defaultLocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://diagonalsewa.com',
    name: 'Diagonal Group',
    image: 'https://diagonalsewa.com/images/gallery/hero.jpg',
    description: 'Professional construction, 3D design, corporate housing, and repair services in Kathmandu, Nepal',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '27.7172',
      longitude: '85.3240'
    },
    telephone: '+977-9801890011',
    email: 'info@diagonal.com',
    url: 'https://diagonalsewa.com',
    priceRange: '$$',
    openingHours: 'Mo-Su 00:00-24:00',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '150'
    }
  };

  // Combine schemas
  const combinedSchema = schemaMarkup 
    ? [defaultOrganizationSchema, defaultLocalBusinessSchema, schemaMarkup]
    : [defaultOrganizationSchema, defaultLocalBusinessSchema];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Diagonal Group" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="author" content="Diagonal Group" />
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Kathmandu" />
      <meta name="geo.position" content="27.7172;85.3240" />
      <meta name="ICBM" content="27.7172, 85.3240" />
      
      {/* Schema.org Structured Data */}
      {combinedSchema.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
