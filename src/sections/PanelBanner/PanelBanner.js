import React from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import { useMode, modes } from "../../ModeContext";
import PanelTitle from "../../components/Title/PanelTitle";
import PanelButton from "../../components/Buttons/PanelButtons/PanelButton";

const PanelBanner = ({ title, text, onClick, onGoBack }) => {
  const [formMode] = useMode();
  return (
    <div className="panel-title-btn__container">
      <PanelTitle title={title} />
      {formMode === modes.VIEW && <PanelButton text={text} onClick={onClick} />}
      {formMode === modes.INFO && (
        <div className="panel-title-btns__container">
          <LeftCircleFilled onClick={onGoBack}/>
          <PanelButton text={text} onClick={onClick} />
        </div>
      )}
    </div>
  );
};

export default PanelBanner;
