import React from "react";
import BigNumber from "bignumber.js/bignumber";

export const InputField = ({
  title,
  current,
  unit,
  onMax,
  onAction,
  onAction1,
  value,
  onChange,
  buttonTitle,
  isConnected,
  isApproved,
  valueApproved,
  tokenDecimals,
  subtitle,
  subtitleForceNormalStyle,
  isDeposit,
}) => (
  <form onSubmit={(e) => e.preventDefault()} className="input-field">
    <div className="input-label">
      <span>{`${title}:`}</span>
      {` ${current !== null && isConnected ? current : "-"} ${unit}`}
    </div>
    <div className="input-container">
      <button className="max-btn" onClick={onMax} disabled={!isConnected}>
        Max
      </button>
      <div className="input">
        <input
          type="number"
          value={value}
          step={0.001}
          onChange={onChange}
          disabled={!isConnected}
          min="0"
        />
      </div>
    </div>
    {subtitle !== null && (
      <div
        className={`${
          isDeposit && subtitleForceNormalStyle
            ? "input-subtitle attention"
            : "input-subtitle"
        }${!isDeposit ? " space" : ""}`}
      >
        {subtitle}
      </div>
    )}
	
    <div className="button-box">
      <button
        className={isDeposit ? "action-btn" : "hide"}
        onClick={onAction1}
        disabled={
          !isConnected ||
          (isDeposit &&
            (!valueApproved ||
              BigNumber(valueApproved).toNumber() >
                BigNumber(value * 10 ** tokenDecimals).toNumber()))
        }
      >
        Approve
      </button>
      <button
        className="action-btn"
        onClick={onAction}
        disabled={
          !isConnected ||
          value <= 0 ||
          value === "0" ||
          value === "" ||
          value === null ||
          value === undefined ||
          (isDeposit &&
            (BigNumber(valueApproved).toNumber() <= 0 ||
              !valueApproved ||
              BigNumber(valueApproved).toNumber() <
                BigNumber(value * 10 ** tokenDecimals).toNumber()))
        }
      >{`${buttonTitle} ${unit}`}</button>
    </div>
	
  </form>
);
