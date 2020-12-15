import React from "react";

export const ConnectButton = ({
  account,
  isDropdown,
  setConnection,
  setDisconnection,
}) => {
  let title;
  if (account !== null) {
    let pt1 = account.slice(0, 3);
    let pt2 = account.slice(-4);
    title = `Connected: ${pt1}...${pt2}`;
  } else {
    title = "Connect wallet";
  }
  return (
    <div className="connect-container">
      <button className="connect-button" onClick={setConnection}>
        {title}
      </button>
      {isDropdown && (
        <button className="disconnect-button" onClick={setDisconnection}>
          Disconnect
        </button>
      )}
    </div>
  );
};

export const HideZeroes = ({ isHidingZeroes, onHideZeroes }) => {
  return (
    <div className="hide-zero-container" onClick={onHideZeroes}>
      <input
        type="checkbox"
        checked={isHidingZeroes}
        onChange={() => null}
        className="hide-zero-box"
      />
      <div className="hide-zero-label">Hide zero balance farms</div>
    </div>
  );
};
