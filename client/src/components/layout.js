/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { useStaticQuery, graphql, navigate } from "gatsby";
import axios from "axios";

import Header from "./header";
import "./layout.css";

const Layout = ({ children }) => {
  let [loggedOn, setLoggedOn] = useState(false);

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  useEffect(() => {
    axios
      .get(`/api/v1/users/me`)
      .then(({ data }) => {
        console.log(data);
        setLoggedOn(true);
      })
      .catch(({ response: err }) => {
        console.log(err);
        if (err.status === 403) {
          alert("You must verify your e-mail address before you can log in !");
        }
        setLoggedOn(false);
      });
  }, []);

  return (
    <>
      {loggedOn ? (
        <div>
          <Helmet>
            <link
              href="https://fonts.googleapis.com/css?family=Cairo&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          <Header siteTitle={data.site.siteMetadata.title} />
          <div
            style={{
              margin: `0 auto`,
              padding: `0`,
              paddingTop: 0,
            }}
          >
            <main>{children}</main>
          </div>
          <footer
            style={{ color: "#48E5C2", textAlign: "center", margin: "42px" }}
          >
            © {new Date().getFullYear()} with love from the
            {` `}
            <a
              href="https://twitter.com/notsilentcorner"
              style={{ color: "#DCF763" }}
            >
              !silentCorner
            </a>
            {` `}
            🍆
          </footer>
        </div>
      ) : (
        navigate(`/signin`)
      )}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
