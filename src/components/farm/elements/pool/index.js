import React, { Component } from "react";
import Box from "./Boxes";
import Row from "./Rows";
import { InputField } from "./inputField";
import { Statistics } from "./Statistics";

export default class Pool extends Component {
  constructor(props) {
    super(props);
    this.token = null;
    this.state = {
      isExpanded: null,
      toDeposit: 0.0,
      toWithdraw: 0.0,
    };
  }

  toggleExpand = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  onMaxDeposit = () => {};

  onMaxWithdraw = () => {};

  onDepostChange = (e) => {
    this.setState({ toDeposit: e.target.value });
  };

  onWithdrawChange = (e) => {
    this.setState({ toWithdraw: e.target.value });
  };

  render() {
    const { w3, token, isSmall } = this.props;
    const { isExpanded, toDeposit, toWithdraw } = this.state;

    return (
      <div
        className={`farm-${isSmall ? "box" : "row"}-container ${
          isExpanded ? "expanded" : ""
        }`}
      >
        {isSmall ? (
          <Box
            token={this.props.token}
            toggleExpand={this.toggleExpand}
            isExpanded={this.state.isExpanded}
          />
        ) : (
          <Row
            token={this.props.token}
            toggleExpand={this.toggleExpand}
            isExpanded={this.state.isExpanded}
          />
        )}
        {isExpanded && (
          <div className="expanded">
            <div className="statistics">
              <div className="title">Statistics:</div>
              <Statistics t={`${token.unit} Deposited`} v={token.deposited} />
              <Statistics t={"Total Earnings"} v={`${token.earnings} GDAO`} />
              <Statistics t={"Claimable Rewards"} v={`${token.rewards} GDAO`} />
            </div>
            <div className="fields">
              <InputField
                title={"Your wallet"}
                current={token.depositable}
                unit={token.unit}
                onMax={this.onMaxDeposit}
                value={toDeposit}
                onChange={(e) => this.onDepositChange(e)}
                buttonTitle={"Deposit"}
              />
              <InputField
                title={"Staked in contract"}
                current={token.deposited}
                unit={token.unit}
                onMax={this.onMaxWithdraw}
                value={toWithdraw}
                onChange={(e) => this.onWithdrawChange(e)}
                buttonTitle={"Withdraw"}
              />
            </div>
            <div className="claims">
              <div className="title">Available rewards:</div>
              <div className="value">{`${token.rewards} GDAO`}</div>
              <div className="btn-container">
                <button className="action-btn">Claim rewards</button>
                <button className="action-btn">Claim & withdraw</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
