/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = actions
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    // The `template` is the name of the directory containing the Markdown file:
    const template = slug.substring(1, slug.length - 1).split('/')[0]

    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
    createNodeField({
      node,
      name: `template`,
      value: template
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
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
              title
            }
          }
        }
      }
    }
  `)

  await result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug
    const title = node.frontmatter.title

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${node.fields.template}.js`),
      // Context data is available in page queries as GraphQL variables.
      context: { slug, title }
    })
  })
}
