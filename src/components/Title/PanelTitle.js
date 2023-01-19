import React from "react";
import "./PanelTitle.scss";

const PanelTitle = (props) => {
  return <h1 className="panel__title">{props.title}</h1>;
};

export default PanelTitle;
