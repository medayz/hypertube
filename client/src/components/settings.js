import React, { useState, useContext } from "react";
import { Modal, Button } from "antd";
import EditForm from "./editinfoform";
import ChangePwdForm from "./changepwd";
import UploadAvatar from "./uploadavatar";
import UserContext from "../context/user";
import "./settings.css";

export default props => {
  let [visible, changeVisibility] = useState(false);
  const { user } = useContext(UserContext);

  const showModal = () => {
    changeVisibility(true);
  };

  const handleCancel = () => {
    changeVisibility(false);
  };

  return (
    <div style={{ margin: "2px", display: "inline-block" }}>
      <Button size="small" icon="setting" onClick={showModal}></Button>
      <Modal
        footer={[
          <Button key="submit" type="primary" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        title="Edit Info"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {user && (
          <UploadAvatar
            url={user.avatar ? `/api/v1/users/avatar/${user.avatar}` : ""}
          />
        )}
        <EditForm />
        <ChangePwdForm />
      </Modal>
    </div>
  );
};
