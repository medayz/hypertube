import React, { useState, useEffect } from "react";
import { Pagination, Typography, Spin, Icon } from "antd";
import axios from "axios";
import "./library.css";

import Layout from "../components/layout";
import Movies from "../components/movies";
import { Z_BLOCK } from "zlib";

const { Title } = Typography;

const PaginationContainer = ({ children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 42px",
    }}
  >
    {children}
  </div>
);
const spinIcon = <Icon type="loading" style={{ fontSize: 69 }} spin />;

export default props => {
  const [movies, updateMovies] = useState([]);
  const [currentPage, updatePage] = useState(1);
  const [total, updateTotal] = useState(200);
  const [loading, updateLoading] = useState(true);

  const switchPage = async page => {
    updateLoading(true);
    axios
      .get(`/api/v1/movies?page=${page}`)
      .then(results => {
        const list = results.data.movies;
        updatePage(page);
        updateMovies(list);
        updateLoading(false);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`/api/v1/movies?page=${currentPage}`)
      .then(async results => {
        const list = results.data.movies;

        updateTotal(results.data.count);
        updateMovies(list);
        updateLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Layout>
      <div id="wallp" className="library-wallpaper">
        <div className="over-wallpaper">
          <Title className=".library-heading">It's Movie Time !</Title>
        </div>
      </div>
      <PaginationContainer>
        <Pagination
          current={currentPage}
          defaultPageSize={75}
          onChange={switchPage}
          total={total}
        />
      </PaginationContainer>
      {!loading ? (
        <Movies list={movies} />
      ) : (
        <Spin
          indicator={spinIcon}
          style={{ margin: "149px auto", display: "block" }}
        />
      )}
      <PaginationContainer>
        <Pagination
          current={currentPage}
          defaultPageSize={75}
          onChange={switchPage}
          total={total}
        />
      </PaginationContainer>
    </Layout>
  );
};
