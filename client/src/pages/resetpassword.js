import React, { useState } from "react";
import "../components/forms.css";
import { Form, Input, Button } from "antd";
import Logo from "../components/image";
import axios from "axios";

const styleOutline = {
  border: 0,
  outline: "none",
};

const ResetPasswordComponent = ({ form, token }) => {
  const { getFieldDecorator, getFieldsValue, setFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    const newPwd = getFieldsValue();
    newPwd.token = token;
    axios
      .post(`/api/v1/users/resetpassword`, newPwd)
      .then(({ data }) => {
        // console.log(data);
      })
      .catch(({ response: { data } }) => {
        const fields = {
          password: {
            value: newPwd.password,
            errors: [new Error(data.error ? data.error.password : "")],
          },
        };
        setFields(fields);
        data.message && alert(data.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <h2 id="my-h2">Reset Password</h2>
      <div className="empty" />
      <Form.Item>
        {getFieldDecorator("password", {
          rules: [{ required: true, message: "Please enter your Password!" }],
        })(
          <Input.Password
            type="password"
            placeholder="Password"
            style={styleOutline}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

const ResetPasswordForm = Form.create({ name: "resetpassword" })(
  ResetPasswordComponent
);

export default ({ token }) => {
  return (
    <div className="form-background">
      <div className="form-group">
        <Logo className="img" size="Medium" />
        <div className="form-controls">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
};
