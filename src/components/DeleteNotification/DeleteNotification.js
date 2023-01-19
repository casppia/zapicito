import React from "react";
import { Alert } from "antd";
import "./DeleteNotification.scss";

export const DeleteNotification = ({ showDeletedAlert, message }) => {
  return (
    showDeletedAlert && (
      <Alert
        className="table__notification--alert"
        message={message}
        type="success"
        showIcon
      />
    )
  );
};
