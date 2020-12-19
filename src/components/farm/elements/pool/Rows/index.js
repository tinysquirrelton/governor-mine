import React from "react";
import { Expander } from "../Expander";
import { RowItem } from "../RowItem";
import "./style.scss";

const Row = (props) => {
  const { token, toggleExpand, isExpanded } = props;
  return (
    <>
      <div className="content" onClick={toggleExpand}>
        <div className="row-logo">
          <img src={token.logo} alt="" draggable={false} />
        </div>
        <RowItem c={"row-name"} t={token.name} s={token.text} />
        <RowItem c={"row-apy"} t={"APY"} s={`${token.apy}%`} />
        <RowItem c={"row-tvl"} t={"TVL"} s={token.tvl} />
        <RowItem
          c={"row-deposit"}
          t={"Available to deposit"}
          s={token.depositable}
        />
        <div className="row-expander">
          <Expander isExpanded={isExpanded} />
        </div>
      </div>
    </>
  );
};

export default Row;
