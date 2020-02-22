import React, { useState, useEffect } from "react";
import { Form, Button, List, Input, Tooltip } from "antd";
import Comment from "./comment";
import axios from "axios";
import "./comment.css";
import moment from "moment";

const { TextArea } = Input;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${
      comments.length > 1 ? "comments" : "comment"
    }`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea
        className="comment-box"
        rows={2}
        onChange={onChange}
        value={value}
      />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

export default props => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmittingState] = useState(false);
  const [value, setValue] = useState("");

  const { imdbid } = props;

  const handleSubmit = () => {
    if (!value) {
      return;
    }

    setSubmittingState(true);

    axios
      .post(`/api/v1/movies/comments/${imdbid}`, { text: value }, headers)
      .then(({ data: allComments }) => {
        setSubmittingState(false);
        setValue("");
        setComments([
          ...comments,
          {
            author: "Hamid",
            avatar:
              "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            content: <p>{value}</p>,
            datetime: (
              <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            ),
          },
        ]);
      })
      .catch(err => console.log(err));
    setTimeout(() => {}, 1000);
  };

  const handleChange = e => {
    setValue(e.target.value);
  };

  useEffect(() => {
    // console.log("comment", props);
    axios
      .get(`/api/v1/movies/comments/${imdbid}`, headers)
      .then(({ data: { comments: allComments } }) => {
        // console.log("comments:", allComments);
        const newComments = allComments.map(
          ({ _id, owner, text, createdAt }) => {
            return {
              _id: _id,
              author: owner.username,
              avatar: `/api/v1/users/${owner._id}/avatar`,
              content: <p>{text}</p>,
              datetime: (
                <Tooltip
                  title={moment(createdAt).format("YYYY-MM-DD HH:mm:ss")}
                >
                  <span>{moment(createdAt).fromNow()}</span>
                </Tooltip>
              ),
            };
          }
        );
        console.log(newComments);
        setComments(newComments);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </div>
  );
};
