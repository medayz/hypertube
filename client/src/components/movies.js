import React from "react";
import { Link } from "gatsby";
import { Typography } from "antd";
import { ImdbIcon, PopCornTimeIcon, PlayIcon } from "../icons";
import "./movies.css";

const { Text } = Typography;

export default props => {
  const click = e => {
    const parent = e.currentTarget;
    const imdb = parent.querySelector(".ratings").style;
    const info = parent.querySelector(".info").style;
    const image = parent.querySelector(".thumbnail").style;
    const btns = parent.querySelector(".ratings").style;
    const rate = parent.querySelector(".rate").style;
    const play = parent.querySelector(".play").style;
    const parentStyle = parent.style;

    if (!("ontouchstart" in document.documentElement)) {
      if (parentStyle.transform === "scaleX(1.1) scaleY(1.6)") {
        parentStyle.zIndex = "0";
        parentStyle.transform = "scale(1)";
        parentStyle.borderRadius = "10px";
        parentStyle.transition = "none";
        image.transition = "none";
        imdb.transition = "none";
        imdb.background = "rgba(4, 42, 43, 0.6)";
        image.top = "0";
        image.transform = "scale(1)";
        imdb.transform = "scale(1)";
        rate.background = "rgba(252, 252, 252, 0)";
        play.background = "rgba(252, 252, 252, 0)";
        btns.bottom = "0";
        btns.transition = "bottom none";
      } else {
        parentStyle.zIndex = "1337";
        parentStyle.borderRadius = "10px 10px 0 0";
        image.transform = "scaleY(.6875) translateY(-25%)";
        imdb.transform = "scaleX(.91) scaleY(.625)";
        parentStyle.transform = "scaleX(1.1) scaleY(1.6)";
        image.transition = "transform .4s";
        imdb.transition = "transform .4s";
        imdb.transform = "scaleX(.91) scaleY(.625)";
        imdb.background = "transparent";
        parentStyle.transition = "transform .4s";
        image.top = "0";
        rate.background = "rgba(252, 252, 252, .21)";
        play.background = "rgba(252, 252, 252, .21)";
        btns.bottom = "33%";
        btns.transition = "bottom .4s";
      }
    } else {
      if (parentStyle.transform === "scaleY(1.6)") {
        parentStyle.zIndex = "0";
        parentStyle.transform = "scale(1)";
        parentStyle.borderRadius = "10px";
        parentStyle.transition = "none";
        image.transition = "none";
        imdb.transition = "none";
        imdb.background = "rgba(4, 42, 43, 0.6)";
        image.top = "0";
        image.transform = "scale(1)";
        imdb.transform = "scale(1)";
        rate.background = "rgba(252, 252, 252, 0)";
        play.background = "rgba(252, 252, 252, 0)";
        btns.bottom = "0";
        btns.transition = "none";
      } else {
        parentStyle.zIndex = "1337";
        parentStyle.borderRadius = "10px 10px 0 0";
        image.transform = "scaleY(.6875) translateY(-25%)";
        parentStyle.transform = "scaleY(1.6)";
        info.transform = "scaleX(.91) scaleY(.55) translateY(-18%)";
        imdb.transform = "scaleY(.625)";
        image.transition = "transform .1s";
        imdb.transition = "transform .1s";
        imdb.background = "transparent";
        parentStyle.transition = "transform .1s";
        image.top = "0";
        rate.background = "rgba(252, 252, 252, .21)";
        play.background = "rgba(252, 252, 252, .21)";
        btns.bottom = "33%";
        btns.transition = "bottom .4";
      }
    }
  };
  const mouseLeave = e => {
    const parent = e.currentTarget;
    const image = parent.querySelector(".thumbnail").style;
    const imdb = parent.querySelector(".ratings").style;
    const btns = parent.querySelector(".ratings").style;
    const rate = parent.querySelector(".rate").style;
    const play = parent.querySelector(".play").style;
    const parentStyle = parent.style;

    if (!("ontouchstart" in document.documentElement)) {
      parentStyle.zIndex = "0";
      parentStyle.transform = "scale(1)";
      parentStyle.transition = "none";
      parentStyle.borderRadius = "10px";
      image.top = "0";
      parentStyle.transition = "none";
      image.transition = "none";
      image.transform = "scale(1)";
      imdb.transform = "scale(1)";
      imdb.transition = "none";
      imdb.background = "rgba(4, 42, 43, 0.6)";
      rate.background = "rgba(252, 252, 252, 0)";
      play.background = "rgba(252, 252, 252, 0)";
      btns.bottom = "0";
    }
  };
  const mouseEnter = e => {
    const parent = e.currentTarget.style;

    if (!("ontouchstart" in document.documentElement)) {
      parent.zIndex = "1337";
      parent.transform = "scale(1.1)";
      parent.borderRadius = "10px 10px 0 0";
    }
    // parent.transformOrigin = "bottom";
  };

  return (
    <div className="movie-container">
      {props.list.map((movie, id) => (
        <div
          key={id}
          className="movie"
          onClick={click}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        >
          <div className="info-container">
            <div className="info">
              <span className="movie-title">{movie.title}</span>
              <span className="movie-release">{movie.year}</span>
              <span className="movie-duration">{`${Math.floor(
                movie.runtime / 60
              )}h ${movie.runtime % 60}min`}</span>
              {movie.genres.map(
                (genre, id) =>
                  id < 2 && (
                    <span key={id} className="movie-genre">
                      {genre}
                    </span>
                  )
              )}
            </div>
          </div>
          <img
            className="thumbnail"
            src={`https://image.tmdb.org/t/p/w500/${movie.poster}`}
            alt={movie.title}
            onClick={() => {}}
          />
          <div className="ratings">
            <Link className="play" to={`/movie/${movie.source.imdbid}`}>
              <PlayIcon style={{ width: "16px", height: "16px" }} />
              <h2>watch</h2>
            </Link>
            <a
              className="rate"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.imdb.com/title/${movie.source.imdbid}`}
            >
              {movie.rating.imdb ? (
                <ImdbIcon
                  style={{
                    display: "inline-block",
                    boxShadow: "2px 2px 2px #042A2B",
                    width: "32px",
                    height: "16px",
                  }}
                  className="imdb"
                />
              ) : (
                <PopCornTimeIcon
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                  }}
                  className="imdb"
                />
              )}
              <h2>
                {movie.rating.imdb
                  ? `${movie.rating.imdb}`
                  : `${movie.rating.loved}%`}
              </h2>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
