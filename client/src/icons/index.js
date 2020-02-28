import React from "react";
import { Icon } from "antd";
import Imdb from "./imdb";
import Popcorn from "./popcorn";
import Play from "./play";
import Timer from "./timer";
import Calendar from "./Calendar";
import FortyTwo from "./42";

const TimerIcon = props => <Icon component={Timer} {...props} />;
const PopCornTimeIcon = props => <Icon component={Popcorn} {...props} />;
const PlayIcon = props => <Icon component={Play} {...props} />;
const ImdbIcon = props => <Icon component={Imdb} {...props} />;
const CalendarIcon = props => <Icon component={Calendar} {...props} />;
const FortyTwoIcon = props => <Icon component={FortyTwo} {...props} />;

export {
  TimerIcon,
  PopCornTimeIcon,
  PlayIcon,
  ImdbIcon,
  CalendarIcon,
  FortyTwoIcon,
};
