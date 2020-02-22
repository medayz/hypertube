import React, { useState, useEffect } from "react";
import { Pagination, Typography, Spin, Icon } from "antd";
import axios from "axios";
import "./library.css";

import Layout from "../components/layout";
import Movies from "../components/movies";

const { Title } = Typography;

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

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
      .get(`/api/v1/movies?page=${page}`, headers)
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
      .get(`/api/v1/movies?page=${currentPage}`, headers)
      .then(async results => {
        const list = results.data.movies;

        updateTotal(results.data.count);
        updateMovies(list);
        updateLoading(false);
      })
      .catch(err => console.log(err));
  }, [currentPage]);

  return (
    <Layout>
      <div id="wallp" className="library-wallpaper">
        <div className="over-wallpaper">
          <div
            style={{
              height: "6vw",
              width: "58vw",
              background: "#FED766",
              display: "block",
              position: "absolute",
              transform: "translateY(-100%) rotate(-2deg)",
              webkitMaskBoxImage:
                "url(https://www.onlygfx.com/wp-content/uploads/2017/04/grunge-brush-stroke-banner-2-6-1024x250.png)",
            }}
          ></div>
          <Title
            className=".library-heading"
            style={{ position: "absolute", transform: "translateY(-100%)" }}
          >
            It's Movie Time !
          </Title>
        </div>
      </div>
      <div className="movies-pagination">
        <PaginationContainer>
          <Pagination
            current={currentPage}
            defaultPageSize={50}
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
            defaultPageSize={50}
            onChange={switchPage}
            total={total}
          />
        </PaginationContainer>
      </div>
    </Layout>
  );
};
