import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.scss";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1, { replace: true });
  };

  return (
    <>
      <div className="notFound">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="notFound-main">
          <h1>404</h1>
          <p>
            It looks like you're lost...
            <br />
            That's a trouble?
          </p>
          <button onClick={handleClick} className="notFound-btn" type="button">
            Go back
          </button>
        </div>
      </div>
    </>
  );
};
