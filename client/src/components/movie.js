import React, { useState, useEffect, useContext } from "react";
import { Typography, Spin, Icon, Button } from "antd";
import { enableBodyScroll } from "body-scroll-lock";
import { TimerIcon, ImdbIcon, PopCornTimeIcon, CalendarIcon } from "../icons";
import axios from "axios";
import ModalVideo from "react-modal-video";
import "../../node_modules/react-modal-video/scss/modal-video.scss";
import "./movie.css";
import Player from "./player";
import Comments from "./comments";
import UserContext from "../context/user";

const { Title, Paragraph } = Typography;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
const spinIcon = <Icon type="loading" style={{ fontSize: 69 }} spin />;

export default ({ imdbid }) => {
  let [loading, updateLoadingState] = useState(true);
  let [movie, updateMovie] = useState({});
  let [trailerModal, showTrailerModal] = useState(false);
  const { user } = useContext(UserContext);

  // const [_dummy, id] = props.imdbid.split("/");
  // const id = ""; //imdbid={props["*"]}

  useEffect(() => {
    const wallp = document.querySelector(".banner").style;
    const body = document.querySelector("body");

    axios
      .get(`/api/v1/movies/${imdbid}`, headers)
      .then(({ data }) => {
        // console.clear();
        // console.log(data.movie);
        enableBodyScroll(body);
        updateMovie(data.movie);
        wallp.background = `url("${data.movie.banner}")`;
        // , url("https://zupimages.net/up/20/08/qs7e.png")
        wallp.backgroundPosition = "top center";
        wallp.backgroundRepeat = "no-repeat";
        wallp.backgroundColor = "#042a2b";
        wallp.backgroundSize = `cover`;
        updateLoadingState(false);
      })
      .catch(err => console.log(err));
  }, [imdbid, user]);

  return (
    <div className="movie-wallpaper">
      {loading ? (
        <Spin
          indicator={spinIcon}
          style={{ margin: "149px auto", display: "block" }}
        />
      ) : (
        <div className="movie-info">
          <div className="content">
            <div className="poster">
              <img
                src={`${movie.poster}`}
                alt={movie.title}
                onError={e => {
                  e.target.src = "https://zupimages.net/up/20/08/aggz.png";
                }}
              />
            </div>
            <div className="info-text">
              <div className="title-n-release">
                <Title className="title">{movie.title}</Title>
              </div>
              {movie.trailer && (
                <div className="trailer">
                  <ModalVideo
                    channel="youtube"
                    isOpen={trailerModal}
                    videoId={movie.trailer}
                    onClose={() => showTrailerModal(false)}
                  />
                  <Button
                    style={{ height: "32px" }}
                    onClick={() => showTrailerModal(true)}
                    size="small"
                    icon="caret-right"
                  >
                    Play Trailer
                  </Button>
                </div>
              )}
              <div>
                <CalendarIcon
                  style={{
                    marginLeft: "4px",
                    width: "21px",
                    height: "21px",
                  }}
                />
                <span className="info-span">{movie.year}</span>
              </div>
              <div>
                <TimerIcon style={{ width: "26px", height: "26px" }} />
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
                      width: "32px",
                      height: "16px",
                    }}
                    className="imdb"
                  />
                ) : (
                  <PopCornTimeIcon
                    style={{
                      display: "inline-block",
                      marginLeft: "",
                      width: "28px",
                      height: "28px",
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
              <Paragraph className="description">{movie.description}</Paragraph>
              {movie.genres.map((genre, id) => (
                <span key={id} className="genre">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="video-streaming">
        {!loading && (
          <Player
            imdbid={imdbid}
            banner={movie.banner}
            lang={user.language}
            subtitles={movie.subtitles}
          />
        )}
      </div>
      <div className="comments">
        <Comments imdbid={imdbid} />
      </div>
      <div className="banner">
        <div className="over-wallpaper"></div>
      </div>
    </div>
  );
};
