import React from "react";
import {
  Player,
  PosterImage,
  BigPlayButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
} from "video-react";
import "../../node_modules/video-react/dist/video-react.css";

export default props => {
  // set the poster image url to `poster` property
  return (
    <Player poster={props.poster}>
      <BigPlayButton position="center" />
      <source src={`/api/v1/stream/${props.imdbid}/720p`} />

      <ControlBar>
        <ReplayControl seconds={10} order={1.1} />
        <ForwardControl seconds={30} order={1.2} />
        <CurrentTimeDisplay order={4.1} />
        <TimeDivider order={4.2} />
        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
        <VolumeMenuButton disabled />
      </ControlBar>
    </Player>
  );
};
