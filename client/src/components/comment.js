import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Comment, Icon, Tooltip, Avatar, Button } from "antd";
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
  const [votes, setVotes] = useState(props.votes);
  const [action, setAction] = useState(
    !props.userVote ? 0 : props.userVote === -1 ? "downvoted" : "upvoted"
  );

  const upvote = () => {
    if (action === "upvoted") {
      setVotes(votes - 1);
      axios
        .post(
          `/api/v1/movies/comments/${props.id}/vote`,
          { value: "regret" },
          headers
        )
        .then(({ data: { votes } }) => {
          setVotes(votes);
        })
        .catch(err => console.log(err));
      setAction("regret");
      return;
    }
    setVotes(votes + 1);
    setAction("upvoted");
    axios
      .post(
        `/api/v1/movies/comments/${props.id}/vote`,
        { value: "up" },
        headers
      )
      .then(({ data: { votes } }) => {
        setVotes(votes);
      })
      .catch(err => console.log(err));
  };

  const downvote = () => {
    if (action === "downvoted") {
      setVotes(votes - 1);
      axios
        .post(
          `/api/v1/movies/comments/${props.id}/vote`,
          { value: "regret" },
          headers
        )
        .then(({ data: { votes } }) => {
          setVotes(votes);
        })
        .catch(err => console.log(err));
      setAction("regret");
      return;
    }
    setAction("downvoted");
    axios
      .post(
        `/api/v1/movies/comments/${props.id}/vote`,
        { value: "down" },
        headers
      )
      .then(({ data: { votes } }) => {
        setVotes(votes);
      })
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
    <span style={{ paddingLeft: 8, cursor: "auto" }}>{`${
      Math.abs(votes) == 1 ? String(votes) + " vote" : String(votes) + " votes"
    }`}</span>,
  ];

  return (
    <Comment
      actions={props.author && actions}
      author={props.author || ""}
      avatar={
        <Button
          size="default"
          onClick={props.showModal}
          style={{
            position: "relative",
            border: 0,
            margin: 0,
            padding: 0,
            background: "transparent",
          }}
        >
          <Avatar
            style={{
              background: "#1A3D3E",
              color: "#DCF763",
              position: "relative",
            }}
            shape="square"
            src={props.avatar || ""}
            alt={props.author || ""}
          >
            {props.author}
          </Avatar>
        </Button>
      }
      content={props.content || ""}
      datetime={props.datetime || ""}
    />
  );
};
