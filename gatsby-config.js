require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Bronson Avila`,
    description: `Personal website of Bronson Avila—an attorney-turned-software developer residing in Hawaii.`,
    author: `@bronsonavila`,
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-109008540-2',
        head: true,
        anonymize: true,
        respectDNT: true,
        pageTransitionDelay: 850,
        // Defers execution of google analytics script after page load
        defer: false,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          require('tailwindcss'),
          require('./tailwind.config.js'),
          require('autoprefixer'),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        // printRejected: true, // Print removed selectors and processed file names
        // develop: true, // Enable while using `gatsby develop`
        tailwind: true, // Enable tailwindcss support
        whitelistPatterns: [/img/, /gatsby/],
        // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /static\/svg/,
        },
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-bronson-avila`,
        short_name: `bronson-avila`,
        start_url: `/`,
        background_color: `#fafafa`,
        theme_color: `#a90000`,
        display: `minimal-ui`,
        icon: `static/logo.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-load-script`,
      options: {
        src: `https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
