import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Icon, message } from "antd";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTUxOGY3ZTZkNGE0ZjAwODFlZmUyNmMiLCJpYXQiOjE1ODI0MDM0NjJ9.SB_f4GDR9v41ntSeVs9pizRXTIr5ku4LRpWgthALb9A";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("Image must smaller than 5MB!");
  }
  return isJpgOrPng && isLt5M;
}

export default props => {
  let [loading, updateLoadingState] = useState(false);
  let [imageUrl, updateImageUrl] = useState(props.url);

  const handleChange = info => {
    if (info.file.status === "uploading") {
      updateLoadingState(true);
      return;
    }
    if (info.file.status === "done") {
      const formData = new FormData();
      formData.append("avatar", info.file.originFileObj);
      axios
        .post(`/api/v1/users/avatar`, formData, headers)
        .then(({ data: { message, filename } }) => {
          updateLoadingState(false);
          updateImageUrl(`/api/v1/users/avatar/${filename}?token=${token}`);
        });
    }
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? "loading" : "plus"} />
      <div className="ant-upload-text">Upload Avatar</div>
    </div>
  );
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
