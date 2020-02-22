import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import axios from "axios";
import "../../node_modules/video.js/dist/video-js.css";
import "./player.css";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
export default props => {
  const { imdbid, banner, subtitles } = props;
  const playerRef = useRef();

  useEffect(() => {
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
            src: `/api/v1/stream/${imdbid}/720p?token=${token}`,
            type: "video/mp4",
          },
        ]);
      }
    );

    return () => {
      player.dispose();
    };
  }, [imdbid, banner]);

  return (
    <div
      data-vjs-player
      style={{
        border: ".42vw solid #000",
        borderRadius: ".42vw",
        backgroundClip: "padding-box",
      }}
    >
      <video ref={playerRef} className="video-js vjs-16-9" playsInline>
        {subtitles.map((item, index) => (
          <track
            default={index ? false : true}
            kind="captions"
            srcLang={item.langShort}
            label={item.lang}
            src={`/api/v1/movies/subtitles/${imdbid}/${item.langShort}?token=${token}`}
          />
        ))}
      </video>
    </div>
  );
};
