import React from "react";
import { Expander } from "../Expander";
import { Statistics } from "../Statistics";
import "./style.scss";

const Box = (props) => {
  const { token, toggleExpand, isExpanded } = props;
 

  return (
    <>
      <div className="upper" onClick={toggleExpand}>
        <div className="box-logo">
          <img src={token.logo} alt="" draggable={false} />
        </div>
        <div className="box-name">
          <div className="title">{token.name}</div>
          <div className="subtitle">{token.text}</div>
        </div>
        <div className="box-expander">
          <Expander isExpanded={isExpanded} />
        </div>
      </div>
      <div className="lower">
        <Statistics t={"APY"} v={`${token.apy}%`} />
        <Statistics t={"TVL"} v={token.tvl} />
      </div>
    </>
  );
};

export default Box;
