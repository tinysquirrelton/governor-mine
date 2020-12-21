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
      userAddress: this.props.w3.address,
      tokenContract: this.props.token.contract,
      farmContract: this.props.farmContract,      
    };
  }

  toggleExpand = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  onMaxDeposit = () => {
    let amountToDeposit = this.props.w3.web3.utils.toWei(this.props.token.depositable.toString()); //converting to big number
    let poolID = this.props.token.poolID;//need poolID for farm contract function
    let farmContractAddress= this.props.farmContract._address;
    let userBalance = this.props.w3.web3.utils.toWei((this.props.token.depositable * 2).toString()); //getting userBalance but multiply by 2 just to be safe - and using web3.utils to convert to big number

    this.state.tokenContract.methods.approve(farmContractAddress, userBalance).send({from: this.state.userAddress})//approving farm contract to spend tokens
                                                                                                                  //you can do a check that allows the user to deposit right away if they already approved before
      .then(res => {                                                                                               //use the token allowance() function to check for this - but probably best to force approval everytime
        if (res.status === true) {                                                                                 
          this.props.farmContract.methods.deposit(poolID,amountToDeposit).send({from: this.state.userAddress});//depositing the amount the user entered                                                                             
        } else {
          //you can alert user here if you want or reapprove
        }
      }) 
  };

  onMaxWithdraw = () => {
    let amountToWithdraw = this.props.w3.web3.utils.toWei(this.props.token.deposited.toString()); //converting to big number
    let poolID = this.props.token.poolID;//need poolID for farm contract function
    this.props.farmContract.methods.withdraw(poolID,amountToWithdraw).send({from: this.state.userAddress})
  };

  onDepositExecute = () => {
    let farmContractAddress= this.props.farmContract._address;
    let userBalance = this.props.w3.web3.utils.toWei((this.props.token.depositable * 2).toString()); 
    let amountToDeposit = this.props.w3.web3.utils.toWei(this.state.toDeposit.toString()); 
    let poolID = this.props.token.poolID;
    this.state.tokenContract.methods.approve(farmContractAddress, userBalance).send({from: this.state.userAddress})
      .then(res => {                                                                                               
        if (res.status === true) {                                                                                 
          this.props.farmContract.methods.deposit(poolID,amountToDeposit).send({from: this.state.userAddress})                                                                           
        } else {
          //you can alert user here if you want or reapprove
        }
      }) 
      
  }

  onWithdrawExcecute = () => {
    let amountToWithdraw = this.props.w3.web3.utils.toWei(this.state.toWithdraw.toString());
    let poolID = this.props.token.poolID;
    this.props.farmContract.methods.withdraw(poolID,amountToWithdraw).send({from: this.state.userAddress})
  }

  onClaim = () => {
    let poolID = this.props.token.poolID;//need poolID for farm contract function
    this.props.farmContract.methods.deposit(poolID,0).send({from: this.state.userAddress})
  }

  onDepositChange = (e) => {
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
                onAction={this.onDepositExecute}
                value={toDeposit}
                onChange={(e) => this.onDepositChange(e)}
                buttonTitle={"Deposit"}
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
              />
            </div>
            <div className="claims">
              <div className="title">Available rewards:</div>
              <div className="value">{`${
                token.rewards !== null ? token.rewards : "-"
              } GDAO`}</div>
              <div className="btn-container">
                <button className="action-btn" onClick={this.onClaim}>Claim Rewards</button>
                <button className="action-btn">Claim & Withdraw</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
