import React, { Component } from "react";
import { toast } from "react-toastify";
import Box from "./Boxes";
import Row from "./Rows";
import { InputField } from "./inputField";
import { Statistics } from "./Statistics";
import { roundValue } from "../../../../utilities/helpers";

export default class Pool extends Component {
  constructor(props) {
    super(props);
    this.token = null;
    this.state = {
      isExpanded: null,
      toDeposit: 0.0,
      toWithdraw: 0.0,
      isApproved: false,
    };
  }

  toggleExpand = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  onConvert = (n) => {
    if (this.props.token.unit === "WBTC" ) {
      return n * (10**8);
    } else if (this.props.token.unit === "USDC" ) {
      return n * (10**6);
    } else {
      return n * (10**18);
    }
  }

  onMaxDeposit = () => {
    this.setState({ toDeposit: this.props.token.depositable });
  };

  onMaxWithdraw = () => {
    this.setState({ toWithdraw: this.props.token.deposited });
  };

  onApprove = () => {
    const { w3, token, farmContract } = this.props;
    let uB = w3.web3.utils.toWei((token.depositable * 3).toString()); // User balance
    token.contract.methods
      .approve(farmContract._address, uB)
      .send({ from: w3.address })
      .then((res) => {
        if (res.status === true) {
          toast.success("Successfully approved.");
          this.setState({isApproved: true});
        } 
      })
      .catch((err) => toast.error("Could not approve."));
  };

  onDepositExecute = () => {
    const { w3, token, farmContract } = this.props;
    const tD = this.state.toDeposit;
    // let d = w3.web3.utils.toWei(tD.toString()); // To deposit
    let d = this.onConvert(tD).toString();

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
  
};

  onWithdrawExcecute = () => {
    const { w3, token, farmContract } = this.props;
    const tW = this.state.toWithdraw;
    // let w = w3.web3.utils.toWei(tW.toString()); // To withdraw
    let w = this.onConvert(tW).toString();

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
    const { isExpanded, toDeposit, toWithdraw, isApproved } = this.state;

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
            isConnected={isConnected}
          />
        ) : (
          <Row
            token={token}
            toggleExpand={this.toggleExpand}
            isExpanded={isExpanded}
            isConnected={isConnected}
          />
        )}
        {isExpanded && (
          <div className="expanded">
            <div className="statistics">
              <div className="title">Statistics:</div>
              <Statistics
                t={`${token.unit} Deposited`}
                v={`${roundValue(token.deposited)} ${token.unit}`}
                isConnected={isConnected}
              />
              <Statistics
                t={"Claimable Rewards"}
                v={`${roundValue(token.rewards)} GDAO`}
                isConnected={isConnected}
              />
            </div>
            <div className="fields">
              <InputField
                title={"Your wallet"}
                current={roundValue(token.depositable)}
                unit={token.unit}
                onMax={this.onMaxDeposit}
                onAction={this.onDepositExecute}
                onAction1={this.onApprove}
                value={toDeposit}
                onChange={(e) => this.onDepositChange(e)}
                buttonTitle={"Deposit"}
                isConnected={isConnected}
                isApproved={isApproved}
                isDeposit={true}
                subtitle={"Deposit Fee: 2%"}
              />
              <InputField
                title={"Staked in contract"}
                current={roundValue(token.deposited)}
                unit={token.unit}
                onMax={this.onMaxWithdraw}
                onAction={this.onWithdrawExcecute}
                value={toWithdraw}
                onChange={(e) => this.onWithdrawChange(e)}
                buttonTitle={"Withdraw"}
                isConnected={isConnected}
                isDeposit={false}
                subtitle={"Withdraw and claim rewards"}
              />
            </div>
            <div className="claims">
              <div className="title">Available rewards:</div>
              <div className="value">{`${
                isConnected ? roundValue(token.rewards) : "-"
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
