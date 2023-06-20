require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

module.exports = {
  siteMetadata: {
    author: 'Bronson Avila',
    authorUsername: '@bronsonavila',
    description: 'Personal website of Bronson Avila — an attorney-turned-software engineer residing in Hawaii.',
    siteUrl: 'https://www.bronsonavila.com',
    title: 'Bronson Avila'
  },
  plugins: [
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-109008540-2',
        head: true,
        anonymize: true,
        respectDNT: true,
        pageTransitionDelay: 850,
        defer: false
      }
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [require('tailwindcss'), require('./tailwind.config.js'), require('autoprefixer')]
      }
    },
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        tailwind: true,
        whitelistPatterns: [/img/, /gatsby/]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /static\/svg/
        }
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-bronson-avila',
        short_name: 'bronson-avila',
        start_url: '/',
        background_color: '#fafafa',
        theme_color: '#a90000',
        display: 'minimal-ui',
        icon: 'static/logo.png'
      }
    },
    'gatsby-transformer-remark',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-root-import'
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ]
}
