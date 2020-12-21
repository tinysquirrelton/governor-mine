import React from "react";

export const RowItem = ({ c, t, s }) => (
  <div className={c}>
    <div className="title">{t}</div>
    <div className="subtitle">
      {s === null ||
      s === "undefined" ||
      s.includes("null") ||
      s.includes("Infinity")
        ? "-"
        : s}
    </div>
  </div>
);
