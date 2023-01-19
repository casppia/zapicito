import React from "react";
import { Alert } from "antd";

export const FormNotification = ({
  isEditMode,
  showSuccessAlert,
  showErrorAlert,
  section,
}) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap-reverse" }}>
      <div className="ant-form-item-label" style={{ opacity: 0 }}>
        Alert
      </div>
      {showSuccessAlert && (
        <Alert
          message={
            isEditMode ? `${section} saved` : `${section} successfully added`
          }
          type="success"
          showIcon
        />
      )}
      {showErrorAlert && (
        <Alert
          align="center"
          message={
            isEditMode
              ? `Error, ${section} can't be saved`
              : `Error, ${section} can't be added`
          }
          type="error"
          showIcon
        />
      )}
    </div>
  );
};
