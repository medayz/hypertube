import React from "react";
import { Icon, Typography } from "antd";
import "./movies.css";

const ImdbSvg = () => (
  <svg
    id="home_img"
    class="ipc-logo"
    xmlns="http://www.w3.org/2000/svg"
    width="42"
    height="21"
    viewBox="0 0 64 32"
    version="1.1"
  >
    <g fill="#F5C518">
      <rect x="0" y="0" width="100%" height="100%" rx="4" />
    </g>
    <g
      transform="translate(8.000000, 7.000000)"
      fill="#000000"
      fill-rule="nonzero"
    >
      <polygon points="0 18 5 18 5 0 0 0" />
      <path d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z" />
      <path d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z" />
      <path d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z" />
    </g>
  </svg>
);

const PopCornTimeSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    version="1.1"
    viewBox="0 0 32 32"
  >
    <path d="M 8,19 C 6.892,19 6,19.944011 6,21.117188 L 6,29.5 C 6,30.331 6.5575,31 7.25,31 l 2.75,0 4,0 4,0 4,0 2.75,0 C 25.4425,31 26,30.331 26,29.5 l 0,-8.382812 C 26,19.944012 25.108,19 24,19 c -1.108,0 -2,0.944012 -2,2.117188 l 0,1.482421 C 22,21.436209 21.108,20.5 20,20.5 c -1.108,0 -2,0.936209 -2,2.099609 l 0,0.542969 C 18,21.955435 17.108,21 16,21 c -1.108,0 -2,0.955435 -2,2.142578 l 0,-0.542969 C 14,21.436209 13.108,20.5 12,20.5 c -1.108,0 -2,0.936209 -2,2.099609 l 0,-1.482421 C 10,19.944012 9.108,19 8,19 Z" />
    <path d="M 19,3 A 8,8 0 0 0 11.601562,7.9648438 4,4 0 0 0 9,7 4,4 0 0 0 5,11 4,4 0 0 0 5.8261719,13.429688 3.5,3.5 0 0 0 4,16.5 3.5,3.5 0 0 0 7.5,20 3.5,3.5 0 0 0 8,19.960938 L 8,21 c 0,1.662 1.338,3 3,3 l 10,0 c 1.662,0 3,-1.338 3,-3 l 0,-0.04102 A 3.5,3.5 0 0 0 24.5,21 3.5,3.5 0 0 0 28,17.5 3.5,3.5 0 0 0 26.208984,14.447266 8,8 0 0 0 27,11 8,8 0 0 0 19,3 Z" />
    <path
      fill="#e6c59a"
      d="M 19,2 A 8,8 0 0 0 11.601562,6.9648438 4,4 0 0 0 9,6 4,4 0 0 0 5,10 4,4 0 0 0 5.8261719,12.429688 3.5,3.5 0 0 0 4,15.5 3.5,3.5 0 0 0 7.5,19 3.5,3.5 0 0 0 8,18.960938 L 8,20 c 0,1.662 1.338,3 3,3 l 10,0 c 1.662,0 3,-1.338 3,-3 l 0,-0.04102 A 3.5,3.5 0 0 0 24.5,20 3.5,3.5 0 0 0 28,16.5 3.5,3.5 0 0 0 26.208984,13.447266 8,8 0 0 0 27,10 8,8 0 0 0 19,2 Z"
    />
    <path
      fill="#a81a1a"
      d="m 19,15 c 0,1.656854 -1.343146,3 -3,3 -1.656854,0 -3,-1.343146 -3,-3 z"
    />
    <circle fill="#3f3f3f" cx="11" cy="13" r="2" />
    <circle fill="#ffffff" cx="11.5" cy="12.5" r=".5" />
    <path
      fill="#e54b3f"
      d="m 24,18 c -1.108,0 -2,0.944471 -2,2.117647 L 22,30 24.75,30 C 25.4425,30 26,29.331 26,28.5 l 0,-8.382353 C 26,18.944471 25.108,18 24,18 Z"
    />
    <path
      fill="#e54b3f"
      d="m 16,20 c -1.108,0 -2,0.955714 -2,2.142857 L 14,30 l 4,0 0,-7.857143 C 18,20.955714 17.108,20 16,20 Z"
    />
    <path
      fill="#ffffff"
      d="m 20,19.5 c -1.108,0 -2,0.9366 -2,2.1 l 0,8.4 4,0 0,-8.4 c 0,-1.1634 -0.892,-2.1 -2,-2.1 z"
    />
    <path
      fill="#e54b3f"
      d="m 8,18 c 1.108,0 2,0.944471 2,2.117647 L 10,30 7.25,30 C 6.5575,30 6,29.331 6,28.5 L 6,20.117647 C 6,18.944471 6.892,18 8,18 Z"
    />
    <path
      fill="#ffffff"
      d="m 12,19.5 c 1.108,0 2,0.9366 2,2.1 l 0,8.4 -4,0 0,-8.4 c 0,-1.1634 0.892,-2.1 2,-2.1 z"
    />
    <circle fill="#3f3f3f" cx="21" cy="13" r="2" />
    <circle fill="#ffffff" cx="21.5" cy="12.5" r=".5" />
    <path
      fill="#ffffff"
      d="M 19,2 A 8,8 0 0 0 11.601562,6.9648438 4,4 0 0 0 9,6 4,4 0 0 0 5,10 4,4 0 0 0 5.0351562,10.505859 4,4 0 0 1 9,7 4,4 0 0 1 11.601562,7.9648438 8,8 0 0 1 19,3 8,8 0 0 1 26.976562,10.509766 8,8 0 0 0 27,10 8,8 0 0 0 19,2 Z M 5.3945312,12.712891 A 3.5,3.5 0 0 0 4,15.5 3.5,3.5 0 0 0 4.0390625,15.996094 3.5,3.5 0 0 1 5.8261719,13.429688 4,4 0 0 1 5.3945312,12.712891 Z m 21.1406248,0.947265 a 8,8 0 0 1 -0.326172,0.78711 3.5,3.5 0 0 1 1.751954,2.558593 A 3.5,3.5 0 0 0 28,16.5 3.5,3.5 0 0 0 26.535156,13.660156 Z"
    />
  </svg>
);

const { Text } = Typography;
const ImdbIcon = props => <Icon component={ImdbSvg} {...props} />;
const PopCornTimeIcon = props => <Icon component={PopCornTimeSvg} {...props} />;
// const play = () => <></>

export default props => {
  const click = e => {
    const parent = e.currentTarget;
    const imdb = parent.querySelector(".ratings").style;
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
        imdb.transition = "none";
        imdb.background = "rgba(4, 42, 43, 0.6)";
        image.top = "0";
        image.transform = "scale(1)";
        imdb.transform = "scale(1)";
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
      }
    }
  };
  const mouseLeave = e => {
    const parent = e.currentTarget;
    const image = parent.querySelector(".thumbnail").style;
    const imdb = parent.querySelector(".ratings").style;
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
            src={movie.poster}
            alt={movie.title}
            onClick={() => {}}
          />
          <div className="ratings">
            {movie.rating.imdb ? (
              <ImdbIcon
                style={{
                  display: "inline-block",
                  boxShadow: "2px 2px 2px #042A2B",
                }}
                className="imdb"
              />
            ) : (
              <PopCornTimeIcon
                style={{
                  display: "inline-block",
                }}
                className="imdb"
              />
            )}
            <h2>{`${movie.rating.loved}%`}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};
