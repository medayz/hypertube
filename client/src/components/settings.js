import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import EditForm from "./editinfoform";
import ChangePwdForm from "./changepwd";
import UploadAvatar from "./uploadavatar";
import axios from "axios";
import "./settings.css";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

export default props => {
  let [visible, changeVisibility] = useState(false);
  let [loading, updateLoadingState] = useState(false);
  let [info, updateInfo] = useState({});

  useEffect(() => {
    axios
      .get(`/api/v1/users/me`, headers)
      .then(({ data }) => {
        console.log(data);
        updateInfo(data);
      })
      .catch(err => console.log(err));
  }, []);
  const showModal = () => {
    changeVisibility(true);
  };

  const handleOk = () => {
    // updateLoadingState(true);
  };

  const handleCancel = () => {
    changeVisibility(false);
  };

  return (
    <div style={{ margin: "2px", display: "inline-block" }}>
      <Button size="small" icon="setting" onClick={showModal}></Button>
      <Modal
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
        title="Edit Info"
        visible={visible}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <UploadAvatar
          url={`/api/v1/users/avatar/${info.avatar}?token=${token}`}
        />
        <EditForm info={info} />
        <ChangePwdForm />
      </Modal>
    </div>
  );
};
