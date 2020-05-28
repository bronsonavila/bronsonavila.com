/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = actions;
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    // The `template` is the name of the directory containing the Markdown file:
    const template = slug.substring(1, slug.length - 1).split('/')[0];

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
    createNodeField({
      node,
      name: `template`,
      value: template,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              template
            }
            frontmatter {
              featured_image
            }
          }
        }
      }
    }
  `);

  // Keep track of all featured images for each `photos` template.
  const photosIndexFeaturedImages = [];

  await result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug;
    // Trim prepending and appending slashes from slug to get directory:
    const relativeDirectory = slug.substring(1, slug.length - 1);

    if (node.fields.template === 'photos') {
      photosIndexFeaturedImages.push(node.frontmatter.featured_image);
    }

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${node.fields.template}.js`),
      // Context data is available in page queries as GraphQL variables.
      context: { slug, relativeDirectory },
    });
  });

  createPage({
    path: '/photos/',
    component: path.resolve(`./src/pages/photos/index.js`),
    context: { featuredImages: photosIndexFeaturedImages },
  });
};
