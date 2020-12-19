import React from "react";
import "./style.scss";

export const HideZeroes = ({ showZeroes, toggleZeroes }) => {
  return (
    <div className="hide-zero-container">
      <input
        type="checkbox"
        checked={showZeroes}
        onChange={toggleZeroes}
        className="hide-zero-box"
      />
      <div className="hide-zero-label">Hide zero balance farms</div>
    </div>
  );
};
