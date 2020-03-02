import React, { useEffect, useRef, useContext, useState } from "react";
import { Icon, Spin, Button } from "antd";
import videojs from "video.js";
import axios from "axios";
import UserContext from "../context/user";
import "../../node_modules/video.js/dist/video-js.css";
import "./player.css";

const spinIcon = <Icon type="loading" style={{ fontSize: 69 }} spin />;

export default props => {
  // let [loading, updateLoadingState] = useState(true);
  const { imdbid, banner, subtitles, qualities } = props;
  const { user } = useContext(UserContext);
  const playerRef = useRef();
  let sent = 0;

  useEffect(() => {
    // console.clear();
    console.log(qualities);

    playerRef.current.timeupdate = function() {
      const coeff = parseInt((this.currentTime * 100) / this.duration / 5);
      const percentage = coeff * 5;
      if (percentage && percentage > sent) {
        axios
          .post(`/api/v1/users/watch/${imdbid}`, { progress: percentage })
          .then(({ data }) => {
            console.log(data);
          })
          .catch(({ response: err }) => {
            console.log(err);
          });
        sent = percentage;
      }
    };
    playerRef.current.loadstart = function() {
      // loading = false;
      console.log("loadstart");
    };

    const player = videojs(
      playerRef.current,
      {
        autoplay: false,
        controls: true,
        poster: banner,
        nativeTextTracks: false,
        nativeControlsForTouch: true,
        playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 2],
      },
      () => {
        player.src([
          {
            src: `/api/v1/stream/${imdbid}/${qualities[0] || "720p"}`,
            type: "video/mp4",
          },
        ]);
      }
    );

    return () => {
      player.dispose();
    };
  }, [playerRef, imdbid, banner, qualities]);

  return (
    <>
      <div
        data-vjs-player
        style={{
          border: ".42vw solid #000",
          borderRadius: ".42vw",
          backgroundClip: "padding-box",
        }}
      >
        <video ref={playerRef} className="video-js vjs-16-9" playsInline>
          {subtitles &&
            subtitles.map((item, index) => (
              <track
                key={index}
                default={item.langShort === user.language ? true : false}
                kind="captions"
                srcLang={item.langShort}
                label={item.lang}
                src={`/api/v1/movies/subtitles/${imdbid}/${item.langShort}`}
              />
            ))}
        </video>
      </div>
      <div className="qualities">
        {!qualities || !qualities.length
          ? "No torrents available for this movie"
          : qualities.map(item => (
              <Button
                onClick={() => {
                  playerRef.current.src = `/api/v1/stream/${imdbid}/${item}`;
                }}
              >
                {item}
              </Button>
            ))}
      </div>
    </>
  );
};
