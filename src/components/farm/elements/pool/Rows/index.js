import React from "react";
import { Expander } from "../Expander";
import { RowItem } from "../RowItem";
import { roundValue } from "../../../../../utilities/helpers";

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
        <RowItem c={"row-apy"} t={"APY"} s={`${roundValue(token.apy)}%`} />
        <RowItem c={"row-tvl"} t={"TVL"} s={`$${roundValue(token.tvl)}`} />
        <RowItem
          c={"row-deposit"}
          t={"Available to deposit"}
          s={roundValue(token.depositable)}
        />
        <div className="row-expander">
          <Expander isExpanded={isExpanded} />
        </div>
      </div>
    </>
  );
};

export default Row;
