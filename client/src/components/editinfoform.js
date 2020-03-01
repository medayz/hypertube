import React, { useEffect, useContext } from "react";
import { Form, Input, Button, Select } from "antd";
import UserContext from "../context/user";
import axios from "axios";

const { Option } = Select;
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

const EditForm = ({ form }) => {
  const { getFieldDecorator } = form;
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = function(e) {
    e.preventDefault();
    const edited = form.getFieldsValue();

    axios
      .patch(`/api/v1/users`, edited)
      .then(({ data }) => {
        console.log(data);
        setUser(data);
      })
      .catch(err => console.log(err.message));
  };

  useEffect(() => form.setFieldsValue(user), []);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator("username", {
          rules: [{ required: true, message: "Please enter your username!" }],
        })(<Input placeholder="Username" style={styleOutline} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("firstName", {
          rules: [{ required: true, message: "Please enter your First Name!" }],
        })(<Input placeholder="First Name" style={styleOutline} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("lastName", {
          rules: [{ required: true, message: "Please enter your Last Name!" }],
        })(<Input placeholder="Last Name" style={styleOutline} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("email", {
          rules: [
            { required: true, message: "Please enter your Email Address!" },
          ],
        })(<Input placeholder="Email Address" style={styleOutline} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("language", {
          rules: [
            { required: true, message: "Choose your prefered language!" },
          ],
        })(
          <Select style={{ width: "32%" }} onChange={() => {}}>
            <Option value="ar">Arabic</Option>
            <Option value="en">English</Option>
            <Option value="fr">French</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="edit-form-button">
          Edit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: "edit" })(EditForm);
