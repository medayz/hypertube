import React, { useState, useEffect, useContext } from "react";
import { Pagination, Typography, Spin, Icon, Select } from "antd";
import axios from "axios";
import "./library.css";
import Movies from "./movies";
import UserContext from "../context/user";

const { Title } = Typography;
const { Option } = Select;

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
const genres = [
  <Option key={1337} value="Action">
    Action
  </Option>,
  <Option key={1338} value="Drama">
    Drama
  </Option>,
  <Option key={1339} value="Comedy">
    Comedy
  </Option>,
  <Option key={1340} value="Romance">
    Romance
  </Option>,
  <Option key={1341} value="Fantasy">
    Fantasy
  </Option>,
  <Option key={1342} value="Sci-Fi">
    Sci-Fi
  </Option>,
];

export default props => {
  const [movies, updateMovies] = useState([]);
  const [currentPage, updatePage] = useState(1);
  const [total, updateTotal] = useState(200);
  const [loading, updateLoading] = useState(true);
  const [genre, updateGenre] = useState("");
  const [sort, updateSort] = useState("");

  const { user } = useContext(UserContext);

  const switchPage = async page => {
    updateLoading(true);
    axios
      .get(`/api/v1/movies?page=${page}&genre=${genre}&sort_by=${sort}`)
      .then(results => {
        const list = results.data.movies;
        updatePage(page);
        updateMovies(list);
        updateLoading(false);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    document.querySelector(".search-results").style.display = "none";
    enableBodyScroll(body);
    axios
      .get(
        `/api/v1/movies?page=${currentPage}&genre=${
          !genre ? "" : genre.toLowerCase()
        }&sort_by=${!sort ? "" : sort.toLowerCase()}`
      )
      .then(async results => {
        const list = results.data.movies;

        console.log(list);
        updateTotal(results.data.count);
        updateMovies(list);
        updateLoading(false);
      })
      .catch(err => console.log(err));
  }, [currentPage, sort, genre]);

  return (
    <>
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
              WebkitMaskBoxImage:
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
        <div className="sortnfilter">
          <Select
            className="filter-sort"
            showSearch
            placeholder="Filter by genres"
            optionFilterProp="children"
            onChange={value => {
              updateGenre(value);
            }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {genres}
          </Select>
          <Select
            className="filter-sort"
            showSearch
            placeholder="Sorting Criteria"
            optionFilterProp="children"
            onChange={value => {
              updateSort(value);
            }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option key={2142} value="Rating">
              Rating
            </Option>
          </Select>
        </div>
        <PaginationContainer>
          <Pagination
            current={currentPage}
            defaultPageSize={50}
            onChange={switchPage}
            total={total}
          />
        </PaginationContainer>
        {!loading ? (
          user && <Movies list={movies} watchList={user.watchList} />
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
    </>
  );
};
