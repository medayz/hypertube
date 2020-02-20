import React, { useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Comment, Icon, Tooltip, Avatar } from "antd";
import moment from "moment";

export default () => {
  const [votes, setVotes] = useState(0);
  const [action, setAction] = useState(null);

  const upvote = () => {
    setVotes(votes + 1);
    setAction("upvoted");
  };

  const downvote = () => {
    setVotes(votes - 1);
    setAction("downvoted");
  };

  const actions = [
    <span key="comment-basic-like">
      <Tooltip title="Like">
        <Icon
          type="up-square"
          theme={action === "upvoted" ? "filled" : "outlined"}
          onClick={upvote}
        />
      </Tooltip>
    </span>,
    <span key=' key="comment-basic-dislike"'>
      <Tooltip title="Dislike">
        <Icon
          type="down-square"
          theme={action === "downvoted" ? "filled" : "outlined"}
          onClick={downvote}
        />
      </Tooltip>
    </span>,
    <span style={{ paddingLeft: 8, cursor: "auto" }}>{votes}</span>,
  ];

  return (
    <Comment
      actions={actions}
      author={<a>Han Solo</a>}
      avatar={
        <Avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
      }
      content={
        <p>
          We supply a series of design principles, practical patterns and high
          quality design resources (Sketch and Axure), to help people create
          their product prototypes beautifully and efficiently.
        </p>
      }
      datetime={
        <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
          <span>{moment().fromNow()}</span>
        </Tooltip>
      }
    />
  );
};
