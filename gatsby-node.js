const fs = require('fs')
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const PAGES_QUERY = `
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
`

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(PAGES_QUERY)

  await result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug
    const title = node.frontmatter.title

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${node.fields.template}.tsx`),
      context: { slug, title }
    })
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = actions
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    const template = slug.substring(1, slug.length - 1).split('/')[0] // Directory containing Markdown (e.g., "photos").

    createNodeField({ node, name: `slug`, value: slug })
    createNodeField({ node, name: `template`, value: template })
  }
}

exports.onPostBuild = () => {
  const serviceWorkerSource = path.join(__dirname, 'src', 'sw.js')
  const serviceWorkerDestination = path.join(__dirname, 'public', 'sw.js')

  fs.writeFileSync(
    serviceWorkerDestination,
    fs
      .readFileSync(serviceWorkerSource, 'utf8')
      .replace('__SERVICE_WORKER_VERSION__', process.env.SERVICE_WORKER_VERSION)
  )
}
