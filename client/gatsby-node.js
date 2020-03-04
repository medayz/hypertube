/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/^\/resetpassword/)) {
    page.matchPath = "/resetpassword/:token";
  } else if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*";
  } else if (page.path.match(/^\/confirmation/)) {
    page.matchPath = "/confirmation/:token";
  }
  createPage(page);
};
