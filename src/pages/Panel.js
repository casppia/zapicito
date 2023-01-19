import React from "react";
import PanelSection from "../templates/Panel/PanelSection";

const Panel = (props) => {
  return <PanelSection menuItemSelected={props.menuItemSelected} />;
};

export default Panel;
