import React from "react";
import { Expander } from "../Expander";
import { RowItem } from "../RowItem";
import { roundValue, convertToETH } from "../../../../../utilities/helpers";

import "./style.scss";

const Row = (props) => {
  const { token, toggleExpand, isExpanded, isConnected } = props;

  return (
    <div className="content" onClick={toggleExpand}>
      <div className="row-logo">
        <img src={token.logo} alt="" draggable={false} />
      </div>
      <RowItem
        c={"row-name"}
        t={token.name}
        s={token.text}
        isConnected={true}
      />
      <RowItem
        c={"row-apy"}
        t={"APY"}
        s={`${roundValue(token.apy)}%`}
        isConnected={isConnected}
      />
      <RowItem
        c={"row-tvl"}
        t={"TVL"}
        s={`$${roundValue(token.tvl)}`}
        isConnected={isConnected}
      />
      <RowItem
        c={"row-deposit"}
        t={"Available to deposit"}
        s={convertToETH(token.depositable,token.unit)}
        isConnected={isConnected}
      />
      <div className="row-expander">
        <Expander isExpanded={isExpanded} />
      </div>
    </div>
  );
};

export default Row;
