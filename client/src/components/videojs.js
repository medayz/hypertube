import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "../../node_modules/video.js/dist/video-js.css";

export default props => {
  const { src, poster } = props;
  const playerRef = useRef();

  useEffect(() => {
    const player = videojs(
      playerRef.current,
      {
        autoplay: false,
        controls: true,
        poster: poster,
        aspectRatio: "16:9",
        fluid: true,
        playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 2],
      },
      () => {
        player.src(src);
      }
    );

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div
      data-vjs-player
      style={{
        width: "80vw",
        margin: "21px auto",
      }}
    >
      <video ref={playerRef} className="video-js vjs-16-9" playsInline>
        <track
          default
          kind="captions"
          srclang="en"
          src={`http://localhost:3000/thewolf.vtt`}
        />
      </video>
    </div>
  );
};
