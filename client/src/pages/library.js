import React, { useState, useEffect } from "react";
import { Pagination, Typography } from "antd";
import axios from "axios";
import "./library.css";

import Layout from "../components/layout";
import Movies from "../components/movies";

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

export default props => {
  const [movies, updateMovies] = useState([]);
  const [currentPage, updatePage] = useState(1);
  const [npages, updateNumPages] = useState(200);

  const switchPage = async page => {
    axios
      .get(`/api/v1/movies?page=${page}`)
      .then(results => {
        const list = results.data.movies;
        updatePage(page);
        updateMovies(list);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`/api/v1/movies?page=${currentPage}`)
      .then(async results => {
        const list = results.data.movies;
        const npages = Math.ceil(results.data.count / 75);
        updateNumPages(npages);
        updateMovies(list);
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
          total={npages * 75}
        />
      </PaginationContainer>
      <Movies list={movies} />
      <PaginationContainer>
        <Pagination
          current={currentPage}
          defaultPageSize={75}
          onChange={switchPage}
          total={npages * 75}
        />
      </PaginationContainer>
    </Layout>
  );
};
