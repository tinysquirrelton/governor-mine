import React from "react";

export const Statistics = ({ t, v }) => (
  <div className="stats">
    <div className="title">{t}:</div>
    <div className="value">
      {v === null || v === "undefined" || v === "null GDAO" || v === "null%"
        ? "-"
        : v}
    </div>
  </div>
);
