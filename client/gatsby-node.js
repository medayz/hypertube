/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;
  // Make the front page match everything client side.
  // Normally your paths should be a bit more judicious.
  if (page.path.match(/^\/movie\/((?!\/).)+\/?$/)) {
    page.matchPath = `/movie/:imdbid`;
    createPage(page);
  } else if (page.path.match(/^\/resetpassword/)) {
    page.matchPath = "/app/:token";
    // Update the page.
    createPage(page);
  }
};
