import { graphql, useStaticQuery } from 'gatsby'
import formatDate from 'utils/formatDate'
import Helmet from 'react-helmet'
import React from 'react'

// Types

type JsonLdProps = {
  author: string
  description: string
  image: string
  lang: string
  title: string
  url: string
}

type MetadataProps = {
  description?: string
  image?: string
  lang?: string
  pathname?: string
  title?: string
}

type SiteMetadata = {
  author: string
  authorUsername: string
  siteUrl: string
  description: string
  title: string
}

// Constants

const SITE_METADATA_QUERY = graphql`
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

// Functions

const setJsonLd = ({ author, description, image, lang, title, url }: JsonLdProps): string => {
  const today = new Date()

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
    image: { '@type': 'ImageObject', url: image }
  })
}

// Components

const Metadata = ({ description, image, lang = 'en', pathname, title }: MetadataProps): JSX.Element => {
  const { siteMetadata } = useStaticQuery<{ site: { siteMetadata: SiteMetadata } }>(SITE_METADATA_QUERY).site

  const metaDescription = description || siteMetadata.description
  const metaImage = image || `${siteMetadata.siteUrl}/icons/icon-512x512.png`
  const metaTitle = title || siteMetadata.title
  const metaUrl = `${siteMetadata.siteUrl}${pathname}`

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
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={siteMetadata.authorUsername} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:title" content={metaTitle} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {setJsonLd({
          author: siteMetadata.author,
          description: metaDescription,
          image: metaImage,
          lang,
          title: metaTitle,
          url: metaUrl
        })}
      </script>
    </Helmet>
  )
}

export default Metadata
