import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';

import formatDate from '../utils/formatDate';

/**
 * Creates `WebPage` schema data in JSON-LD format.
 *
 * @param {String} author - The author of the page
 * @param {String} description - The description of the page
 * @param {String} image - An image URL
 * @param {String} lang - The language of the page (BCP47 syntax)
 * @param {String} title - The title of the page
 * @param {String} url - The URL of the page
 */
const setJsonLd = ({ author, description, image, lang, title, url }) => {
  const today = new Date();

  return JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    url,
    headline: title,
    inLanguage: lang,
    mainEntityOfPage: url,
    description,
    name: title,
    author: { '@type': 'Person', name: author },
    copyrightHolder: { '@type': 'Person', name: author },
    copyrightYear: today.getFullYear(),
    creator: { '@type': 'Person', name: author },
    publisher: { '@type': 'Person', name: author },
    datePublished: formatDate(today),
    dateModified: formatDate(today),
    image: { '@type': 'ImageObject', url: image },
  });
};

/**
 * Metadata
 *
 * @param {String} description - The description of the page
 * @param {String} image - An image URL
 * @param {String} [lang='en'] - The language of the page (BCP47 syntax)
 * @param {String} pathname - The page's path derived from React Router's `location`
 * @param {String} title - The title of the page
 */
const Metadata = ({ description, image, lang = 'en', pathname, title }) => {
  const { siteMetadata } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author
            authorUsername
            siteUrl
            description
            title
          }
        }
      }
    `
  ).site;

  const metaDescription = description || siteMetadata.description;
  const metaImage = image || `${siteMetadata.siteUrl}/icons/icon-512x512.png`;
  const metaTitle = title || siteMetadata.title;
  const metaUrl = `${siteMetadata.siteUrl}${pathname}`;

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={metaTitle}
      titleTemplate={title ? `%s | ${siteMetadata.title}` : siteMetadata.title}
    >
      <link rel="canonical" href={metaUrl} />
      <meta name="description" content={metaDescription} />
      <meta name="image" content={metaImage} />
      {/* Open Graph */}
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={siteMetadata.authorUsername} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {setJsonLd({
          author: siteMetadata.author,
          description: metaDescription,
          image: metaImage,
          lang,
          title: metaTitle,
          url: metaUrl,
        })}
      </script>
    </Helmet>
  );
};

export default Metadata;
