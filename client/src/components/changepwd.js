import React from "react";
import { Form, Input, Button, Select } from "antd";
import axios from "axios";

const styleOutline = {
  border: "0",
  outline: "none",
};

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

const ChangePwdForm = ({ form }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = function(e) {
    e.preventDefault();
    const newPwd = form.getFieldsValue();
    axios
      .patch(`/api/v1/users/password`, newPwd, headers)
      .then(({ data }) => {
        console.log(data);
      })
      .catch(({ response: { data } }) => console.log(data.error));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator("oldPassword", {
          rules: [{ required: true, message: "Please enter your Password!" }],
        })(
          <Input
            type="password"
            placeholder="Old Password"
            style={styleOutline}
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("newPassword", {
          rules: [
            {
              required: true,
              message: "Please confirm the password you entered!",
            },
          ],
        })(
          <Input
            type="password"
            placeholder="New Password"
            style={styleOutline}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="change-pwd-button">
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: "ChangePwd" })(ChangePwdForm);
