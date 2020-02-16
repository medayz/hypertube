import React, { useState, useEffect } from "react";
import { Typography, Spin, Icon } from "antd";
import { TimerIcon, ImdbIcon, PopCornTimeIcon, CalendarIcon } from "../icons";
import axios from "axios";
import "./movie.css";
import Layout from "../components/layout";

const { Title, Paragraph } = Typography;
const spinIcon = <Icon type="loading" style={{ fontSize: 69 }} spin />;

export default props => {
  let [loading, updateLoadingState] = useState(true);
  let [movie, updateMovie] = useState({});

  useEffect(() => {
    const [id] = props["*"].split("/");
    const wallp = document.querySelector(".banner").style;

    axios
      .get(`/api/v1/movies/${id}`)
      .then(({ data }) => {
        console.log(data.movie);
        updateMovie(data.movie);
        wallp.background = `url("https://image.tmdb.org/t/p/w1280/${data.movie.banner}") top center no-repeat #042a2b`;
        wallp.backgroundSize = `contain`;
        updateLoadingState(false);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Layout>
      <div className="movie-wallpaper">
        <div className="over-wallpaper">
          {loading ? (
            <Spin
              indicator={spinIcon}
              style={{ margin: "149px auto", display: "block" }}
            />
          ) : (
            <div className="movie-info">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster}`}
                alt={movie.title}
              />
              <div className="info-text">
                <div className="title-n-release">
                  <Title className="title">{movie.title}</Title>
                </div>
                <div>
                  <CalendarIcon
                    style={{
                      marginLeft: ".6vw",
                      width: "2vw",
                      height: "2vw",
                    }}
                  />
                  <span className="info-span">{movie.year}</span>
                </div>
                <div>
                  <TimerIcon style={{ width: "2.8vw", height: "2.8vw" }} />
                  <span className="info-span">{`${Math.floor(
                    movie.runtime / 60
                  )}h ${movie.runtime % 60}min`}</span>
                </div>
                <div>
                  {movie.rating && movie.rating.imdb ? (
                    <ImdbIcon
                      style={{
                        display: "inline-block",
                        boxShadow: "2px 2px 2px #042A2B",
                        width: "6vw",
                        height: "3vw",
                      }}
                      className="imdb"
                    />
                  ) : (
                    <PopCornTimeIcon
                      style={{
                        display: "inline-block",
                        marginLeft: ".2vw",
                        width: "2.8vw",
                        height: "2.8vw",
                      }}
                      className="imdb"
                    />
                  )}
                  <span className="info-span">
                    {movie.rating && movie.rating.imdb
                      ? `${movie.rating && movie.rating.imdb}`
                      : `${movie.rating && movie.rating.loved}%`}
                  </span>
                </div>
                <Paragraph className="description">
                  {movie.description}
                </Paragraph>
                {movie.genres &&
                  movie.genres.map((genre, id) => (
                    <span key={id} className="genre">
                      {genre}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="banner"></div>
      </div>
    </Layout>
  );
};
