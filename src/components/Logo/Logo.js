import React from "react";
import "./Logo.scss";

const Logo = ({ onClick }) => {
  return <div onClick={onClick} className="logo" />;
};

export default Logo;
