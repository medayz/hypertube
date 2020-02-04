import React from "react";
import { Popover } from "antd";
import "./movies.css";

// const play = () => <></>

export default props => {
  const click = e => {
    const parent = e.currentTarget;
    // const infoContainer = parent.querySelector(".info-container");
    const info = parent.querySelector(".info").style;
    const image = parent.querySelector(".thumbnail").style;
    const parentStyle = parent.style;

    if (!("ontouchstart" in document.documentElement)) {
      if (parentStyle.transform === "scaleX(1.1) scaleY(1.6)") {
        parentStyle.zIndex = "0";
        parentStyle.transform = "scale(1)";
        parentStyle.borderRadius = "10px";
        parentStyle.transition = "none";
        image.transition = "none";
        image.top = "0";
        image.transform = "scale(1)";
      } else {
        parentStyle.zIndex = "1337";
        parentStyle.borderRadius = "10px 10px 0 0";
        image.transform = "scaleY(.6875) translateY(-25%)";
        parentStyle.transform = "scaleX(1.1) scaleY(1.6)";
        image.transition = "transform .5s";
        parentStyle.transition = "transform .5s";
        image.top = "0";
      }
    } else {
      if (parentStyle.transform === "scaleY(1.6)") {
        parentStyle.zIndex = "0";
        parentStyle.transform = "scale(1)";
        parentStyle.borderRadius = "10px";
        parentStyle.transition = "none";
        image.transition = "none";
        image.top = "0";
        image.transform = "scale(1)";
      } else {
        parentStyle.zIndex = "1337";
        parentStyle.borderRadius = "10px 10px 0 0";
        image.transform = "scaleY(.6875) translateY(-25%)";
        parentStyle.transform = "scaleY(1.6)";
        info.transform = "scaleX(.91) scaleY(.55) translateY(-18%)";
        image.transition = "transform .1s";
        parentStyle.transition = "transform .1s";
        image.top = "0";
      }
    }
  };
  const mouseLeave = e => {
    const parent = e.currentTarget;
    const image = parent.querySelector(".thumbnail").style;
    // const infoContainer = parent.querySelector(".info-container").style;
    // const info = parent.querySelector(".info").style;
    const parentStyle = parent.style;

    if (!("ontouchstart" in document.documentElement)) {
      parentStyle.zIndex = "0";
      parentStyle.transform = "scale(1)";
      parentStyle.transition = "none";
      parentStyle.borderRadius = "10px";
      parentStyle.borderWidth = "3px";
      image.top = "0";
      parentStyle.transition = "none";
      image.transition = "none";
      image.transform = "scale(1)";
    }
  };
  const mouseEnter = e => {
    const parent = e.currentTarget.style;

    if (!("ontouchstart" in document.documentElement)) {
      parent.zIndex = "1337";
      parent.transform = "scale(1.1)";
      parent.borderRadius = "10px 10px 0 0";
      parent.borderWidth = "4px";
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
            src={movie.poster}
            alt={movie.title}
            onClick={() => {}}
          />
        </div>
      ))}
    </div>
  );
};
