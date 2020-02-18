import React, { useState, useEffect } from "react";
import { Typography, Spin, Icon, Button } from "antd";
import {
  TimerIcon,
  ImdbIcon,
  PopCornTimeIcon,
  CalendarIcon,
  PlayIcon,
} from "../icons";
import axios from "axios";
import ModalVideo from "react-modal-video";
import "../../node_modules/react-modal-video/scss/modal-video.scss";
import "./movie.css";
import Layout from "../components/layout";
import Player from "../components/video-react-player";

const { Title, Paragraph } = Typography;
const spinIcon = <Icon type="loading" style={{ fontSize: 69 }} spin />;

export default props => {
  let [loading, updateLoadingState] = useState(true);
  let [movie, updateMovie] = useState({});
  let [trailerModal, showTrailerModal] = useState(false);

  useEffect(() => {
    const [id] = props["*"].split("/");
    const wallp = document.querySelector(".banner").style;

    axios
      .get(`/api/v1/movies/${id}`)
      .then(({ data }) => {
        console.log(data.movie);
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
  }, []);

  return (
    <Layout>
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
                      style={{ margin: 0 }}
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
                        width: "21px",
                        height: "21px",
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
          </div>
        )}
        <div className="banner">
          <div className="over-wallpaper"></div>
        </div>
      </div>
      {movie.source && movie.source.imdbid && (
        <div>
          <Player
            poster={movie.banner || ""}
            imdbid={movie.source.imdbid || ""}
          />
        </div>
      )}
    </Layout>
  );
};
