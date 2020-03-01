import { Link, navigate } from "gatsby";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Input, Button, Spin, Icon, Typography, Avatar } from "antd";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import SettingsButton from "./settings";
import Logo from "./image";
import Movies from "./movies";
import axios from "axios";
import "./header.css";

const spinIcon = <Icon type="loading" style={{ fontSize: 69 }} spin />;
const { Search } = Input;
const { Title } = Typography;

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

const Header = ({ siteTitle }) => {
  let [movies, updateMovies] = useState([]);
  let [loading, updateLoadingState] = useState(false);

  const onChange = value => {
    const resultsContainer = document.querySelector(".search-results").style;
    const body = document.querySelector("body");

    if (value) {
      resultsContainer.display = "block";
      disableBodyScroll(body);
    } else {
      updateMovies([]);
      updateLoadingState(false);
      resultsContainer.display = "none";
      enableBodyScroll(body);
    }
  };
  const onSearch = value => {
    updateLoadingState(true);
    axios
      .get(`/api/v1/movies/search?q=${value}`, headers)
      .then(({ data }) => {
        updateMovies(data.movies);
        updateLoadingState(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <header className="header">
      <div className="search-results">
        <div className="browse-wallp">
          <div className="over-wallpaper">
            <Title className="browse-heading">{`Browse Movies...`}</Title>
          </div>
        </div>
        {!loading ? (
          <Movies list={movies} />
        ) : (
          <Spin
            indicator={spinIcon}
            style={{ margin: "149px auto", display: "block" }}
          />
        )}
      </div>
      <Link
        to="/app/library"
        style={{
          color: `#48E5C2`,
          textDecoration: `none`,
        }}
      >
        <Logo className="img" size="Small" />
      </Link>
      <Search
        placeholder="search for movies..."
        onChange={event => onChange(event.currentTarget.value)}
        onSearch={onSearch}
        style={{ width: "300px", maxWidth: "42%" }}
      />
      <div className="header-btns">
        <Button
          size="small"
          icon="logout"
          style={{ margin: "2px" }}
          onClick={() => {
            axios
              .get("/api/v1/users/logout")
              .then(() => navigate("/signin"))
              .catch(err => console.log(err));
          }}
        />
        <SettingsButton />
        <Avatar shape="square" size="medium" style={{ marginLeft: ".42vw" }}>
          {`test`}
        </Avatar>
      </div>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
