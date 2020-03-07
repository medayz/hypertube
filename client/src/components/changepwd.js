import React from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";

const styleOutline = {
  border: "0",
  outline: "none",
};

const ChangePwdForm = ({ form }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = function(e) {
    e.preventDefault();
    const newPwd = form.getFieldsValue();
    axios
      .patch(`/api/v1/users/password`, newPwd)
      .then(({ data }) => {
        // console.log(data);
        alert("Password updated");
      })
      .catch(({ response: { data } }) => {
        // console.log(data.error);
        alert("Please, Verify your info and try again!");
      });
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
