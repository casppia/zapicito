import React from "react";
import "./PanelButton.scss";

const PanelButton = ({onClick, text}) => {
  return (
    <button onClick={onClick} className="panel-form-btn">
      {text}
    </button>
  );
};

export default PanelButton;
