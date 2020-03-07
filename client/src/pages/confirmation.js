import React, { useEffect } from "react";
import { Icon, Spin } from "antd";
import { navigate } from "gatsby";
import axios from "axios";

const styleOutline = {
  border: 0,
  outline: "none",
};

const spinIcon = <Icon type="loading" style={{ fontSize: 69 }} spin />;

export default ({ token }) => {
  useEffect(() => {
    axios
      .get(`/api/v1/users/verification/${token}`)
      .then(({ data }) => {
        // console.log(data);
        alert(
          "Congratulations! you've just confirmed your e-mail address, enjoy some good movies :D"
        );
        navigate("/signin");
      })
      .catch(({ response: { data } }) => {
        alert(data.message);
        navigate("/signin");
      });
  });
  return (
    <Spin
      indicator={spinIcon}
      style={{ margin: "149px auto", display: "block" }}
    />
  );
};
