import React from "react";

export const InputField = ({
  title,
  current,
  unit,
  onMax,
  value,
  onChange,
  buttonTitle,
}) => (
  <form onSubmit={(e) => e.preventDefault()} className="input-field">
    <div className="input-label">
      <span>{`${title}:`}</span>
      {` ${current !== null ? current : 0} ${unit}`}
    </div>
    <div className="input-container">
      <button className="max-btn" onClick={onMax}>
        Max
      </button>
      <div className="input">
        <input type="number" value={value} step={0.001} onChange={onChange} />
      </div>
    </div>
    <button className="action-btn">{`${buttonTitle} ${unit}`}</button>
  </form>
);
