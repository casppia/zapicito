import React from "react";
import { Alert } from "antd";
import "./SaveNotification.scss";

export const SaveNotification = ({ showSavedAlert }) => {
  return (
    showSavedAlert && (
      <Alert
        className="table__notification--alert"
        message={"Changes saved"}
        type="success"
        showIcon
      />
    )
  );
};
