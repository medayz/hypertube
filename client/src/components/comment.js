import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Comment, Icon, Tooltip, Avatar } from "antd";
import moment from "moment";
import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

export default props => {
  const [votes, setVotes] = useState(0);
  const [action, setAction] = useState(null);

  const upvote = () => {
    setVotes(votes + 1);
    setAction("upvoted");
    axios
      .post(
        `/api/v1/movies/comments/${props._id}/vote`,
        { value: "down" },
        headers
      )
      .then(({ data: { changed } }) =>
        changed ? setVotes(votes) : setVotes(votes - 1)
      )
      .catch(err => console.log(err));
  };

  const downvote = () => {
    setVotes(votes - 1);
    setAction("downvoted");
    axios
      .post(
        `/api/v1/movies/comments/${props._id}/vote`,
        { value: "up" },
        headers
      )
      .then(({ data: { changed } }) =>
        changed ? setVotes(votes) : setVotes(votes + 1)
      )
      .catch(err => console.log(err));
  };

  const actions = [
    <span key="comment-basic-like">
      <Tooltip title="upvote">
        <Icon
          type="up-square"
          theme={action === "upvoted" ? "filled" : "outlined"}
          onClick={upvote}
        />
      </Tooltip>
    </span>,
    <span key=' key="comment-basic-dislike"'>
      <Tooltip title="downvote">
        <Icon
          type="down-square"
          theme={action === "downvoted" ? "filled" : "outlined"}
          onClick={downvote}
        />
      </Tooltip>
    </span>,
    <span style={{ paddingLeft: 8, cursor: "auto" }}>{`${votes} votes`}</span>,
  ];

  return (
    <Comment
      actions={props.author && actions}
      author={props.author || ""}
      avatar={<Avatar src={props.avatar || ""} alt={props.author || ""} />}
      content={props.content || ""}
      datetime={props.datetime || ""}
    />
  );
};
