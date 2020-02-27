import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Typography } from "antd";
import EditForm from "./editinfoform";
import ChangePwdForm from "./changepwd";
import UploadAvatar from "./uploadavatar";
import axios from "axios";
import "./profile.css";

const { Meta } = Card;
const { Title, Text } = Typography;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";

export default ({ visible, handleCancel, user }) => {
  let [loading, updateLoadingState] = useState(false);

  return (
    <Modal
      footer={[
        <Button
          key="close"
          type="primary"
          loading={loading}
          onClick={handleCancel}
        >
          Close
        </Button>,
      ]}
      title="Profile"
      visible={visible}
    >
      <Card
        style={{ width: "100%", border: 0 }}
        cover={
          <img
            alt="example"
            src={`/api/v1/users/avatar/${user.avatar}?token=${token}`}
          />
        }
      >
        <Title level={3}>{user.username}</Title>
        <div className="detail">
          <Text strong>{`First Name:`}</Text>
          <Text>{` ${user.firstName}`}</Text>
        </div>
        <div className="detail">
          <Text strong>{`Last Name:`}</Text>
          <Text>{` ${user.lastName}`}</Text>
        </div>
      </Card>
    </Modal>
  );
};
