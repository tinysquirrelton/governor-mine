import React, { Component } from "react";
import { toast } from "react-toastify";
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

  onMaxDeposit = () => {
    this.setState({ toDeposit: this.props.token.depositable });
  };

  onMaxWithdraw = () => {
    this.setState({ toDeposit: this.props.token.deposited });
  };

  onDepositExecute = () => {
    const { w3, token, farmContract } = this.props;
    const tD = this.state.toDeposit;
    let uB = w3.web3.utils.toWei((token.depositable * 2).toString()); // User balance
    let d = w3.web3.utils.toWei(tD.toString()); // To deposit

    token.contract.methods
      .approve(farmContract._address, uB)
      .send({ from: w3.address })
      .then((res) => {
        if (res.status === true) {
          farmContract.methods
            .deposit(token.pid, d)
            .send({ from: w3.address })
            .then((res) => {
              toast.success("Successfully deposited.");
              token.deposited =
                token.deposited === null ? tD : token.deposited + tD;
              this.setState({ toDeposit: 0.0 });
            })
            .catch((err) => toast.error("Could not deposit."));
        } else {
          toast.error("Could not deposit.");
        }
      });
  };

  onWithdrawExcecute = () => {
    const { w3, token, farmContract } = this.props;
    const tW = this.state.toWithdraw;
    let w = w3.web3.utils.toWei(tW.toString()); // To withdraw

    farmContract.methods
      .withdraw(token.pid, w)
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Successfully withdrawn.");
        token.deposited = token.deposited < tW ? 0 : token.deposited - tW;
        this.setState((prevState) => ({
          toWithdraw: 0.0,
          toDeposit: prevState.toDeposit + tW,
        }));
      })
      .catch((err) => toast.error("Could not withdraw."));
  };

  onClaim = () => {
    const { w3, token, farmContract } = this.props;
    farmContract.methods
      .deposit(token.pid, 0)
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Rewards claimed.");
        token.rewards = null;
        this.setState({});
      })
      .catch((err) => toast.error("Could not claim rewards."));
  };

  onDepositChange = (e) => {
    this.setState({ toDeposit: e.target.value });
  };

  onWithdrawChange = (e) => {
    this.setState({ toWithdraw: e.target.value });
  };

  render() {
    const { token, isSmall, isConnected } = this.props;
    const { isExpanded, toDeposit, toWithdraw } = this.state;

    return (
      <div
        className={`farm-${isSmall ? "box" : "row"}-container ${
          isExpanded ? "expanded" : ""
        }`}
      >
        {isSmall ? (
          <Box
            token={token}
            toggleExpand={this.toggleExpand}
            isExpanded={isExpanded}
          />
        ) : (
          <Row
            token={token}
            toggleExpand={this.toggleExpand}
            isExpanded={isExpanded}
          />
        )}
        {isExpanded && (
          <div className="expanded">
            <div className="statistics">
              <div className="title">Statistics:</div>
              <Statistics
                t={`${token.unit} Deposited`}
                v={`${token.deposited} ${token.unit}`}
              />
              <Statistics t={"Claimable Rewards"} v={`${token.rewards} GDAO`} />
            </div>
            <div className="fields">
              <InputField
                title={"Your wallet"}
                current={token.depositable}
                unit={token.unit}
                onMax={this.onMaxDeposit}
                onAction={this.onDepositExecute}
                value={toDeposit}
                onChange={(e) => this.onDepositChange(e)}
                buttonTitle={"Deposit"}
                isConnected={isConnected}
              />
              <InputField
                title={"Staked in contract"}
                current={token.deposited}
                unit={token.unit}
                onMax={this.onMaxWithdraw}
                onAction={this.onWithdrawExcecute}
                value={toWithdraw}
                onChange={(e) => this.onWithdrawChange(e)}
                buttonTitle={"Withdraw"}
                isConnected={isConnected}
              />
            </div>
            <div className="claims">
              <div className="title">Available rewards:</div>
              <div className="value">{`${
                token.rewards !== null ? token.rewards : "-"
              } GDAO`}</div>
              <button
                className="claim-btn"
                onClick={this.onClaim}
                disabled={!isConnected}
              >
                Claim Rewards
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
