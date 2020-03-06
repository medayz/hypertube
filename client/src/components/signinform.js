import React, { useState, useEffect } from "react";
import "./forms.css";
import { Form, Input, Button, Icon } from "antd";
import { FortyTwoIcon } from "../icons";
import { Link, navigate } from "gatsby";
import axios from "axios";

const styleOutline = {
  border: "0",
  outline: "none",
};

const SignInForm = ({ form }) => {
  let [pwd, setType] = useState(false);
  let [username, setUsername] = useState("");

  const { getFieldDecorator, getFieldsValue, setFieldsValue, setFields } = form;

  const handleUsernameSubmit = e => {
    e.preventDefault();
    const user = getFieldsValue();
    axios
      .get(`/api/v1/users/${user.username}`)
      .then(({ data }) => {
        setType(true);
        setUsername(user.username);
        console.log(data);
      })
      .catch(({ response: err }) => {
        console.log(err);
        const message = !user.username
          ? "Please enter your Username!"
          : err.status === 404
          ? "Username not registered"
          : err.data.message;
        const fields = {
          username: { value: user.username, errors: [new Error(message)] },
        };
        setFields(fields);
      });
  };

  const handlePasswordSubmit = e => {
    e.preventDefault();
    const formData = getFieldsValue();
    const user = {
      username: username,
      password: formData.password,
    };
    console.log(user);
    axios
      .post(`/api/v1/users/login`, user)
      .then(({ data }) => {
        console.log(data);
        navigate(`/app/library`);
      })
      .catch(({ response: { data } }) => {
        let message =
          data.details.email || data.details.password || "Cannot login";

        const fields = {
          password: {
            value: user.password,
            errors: [new Error(message)],
          },
        };
        setFields(fields);
      });
  };

  const handleUsernameChange = e => {
    e.preventDefault();
    console.log(username);
    setUsername(e.target.value);
  };

  return (
    <Form
      onSubmit={pwd ? handlePasswordSubmit : handleUsernameSubmit}
      className="login-form"
    >
      <h2 id="my-h2">SIGN IN</h2>
      <div>
        {pwd && (
          <Button
            icon="caret-left"
            style={{ border: 0, float: "left" }}
            onClick={() => {
              setType(false);
            }}
          />
        )}
        {pwd ? (
          <div className="user-badge">
            <span>{username}</span>
          </div>
        ) : (
          <div className="empty">
            <a href="http://localhost:3000/api/v1/users/auth/google">
              <Icon
                type="google-square"
                theme="filled"
                style={{ fontSize: "21px", borderRadius: "4px" }}
              />
            </a>
            <a href="http://localhost:3000/api/v1/users/auth/42">
              <FortyTwoIcon style={{ width: 19, height: 19, marginTop: 1 }} />
            </a>
            <a href="http://localhost:3000/api/v1/users/auth/facebook">
              <Icon
                type="facebook"
                theme="filled"
                style={{ fontSize: "21px", borderRadius: "4px" }}
              />
            </a>
          </div>
        )}
        {pwd && (
          <Button
            icon="caret-right"
            style={{ border: 0, float: "right" }}
            onClick={handlePasswordSubmit}
          />
        )}
      </div>
      {pwd ? (
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please enter your Password!" }],
          })(
            <Input
              type="password"
              placeholder="Password"
              style={styleOutline}
            />
          )}
        </Form.Item>
      ) : (
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please enter your Username!" }],
          })(
            <Input
              placeholder="Username"
              style={styleOutline}
              onChange={handleUsernameChange}
            />
          )}
        </Form.Item>
      )}
      <Form.Item>
        {pwd ? (
          <a
            className="login-form-forgot"
            onClick={() => {
              axios
                .get(`/api/v1/users/resetpassword/${username}`)
                .then(({ data }) => {
                  console.log(data);
                })
                .catch(({ response: err }) => {
                  console.log(err);
                });
            }}
          >
            Forgot Password ?
          </a>
        ) : (
          <Link className="login-form-forgot" to="/signup">
            Sign Up ?
          </Link>
        )}
        <Button type="primary" htmlType="submit" className="login-form-button">
          {pwd ? "SIGN IN" : "NEXT"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: "login" })(SignInForm);
