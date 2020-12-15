import React, { Component } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Token } from "../../../utilities/token";

import "./style.scss";

class FarmRow extends Component {
  constructor(props) {
    super(props);
    this.token = null;
    this.state = {
      justMounted: null,
      isExpanded: null,
      deposited: null,
      earnings: null,
      rewards: null,
      stakable: null,
      toDeposit: 0.0,
      toWithdraw: 0.0,
    };
  }

  componentDidMount() {
    this.token = new Token(
      this.props.pool.name,
      this.props.pool.text,
      this.props.pool.unit,
      this.props.pool.address
    );
    if (this.token) {
      this.token.setContract();
    }

    this.setState({
      justMounted: true,
      deposited: 17.2,
      earnings: 9,
      rewards: 100,
      stakable: 1231,
      staked: 665,
    });
  }

  componentDidUpdate(prevState) {
    if (
      this.state.justMounted &&
      this.state.justMounted !== prevState.justMounted
    ) {
      this.token.setBalance(this.props.account);
      this.setState({ justMounted: false });
    }
  }

  onMaxDeposit = () => {
    this.setState({ toDeposit: this.state.stakable });
  };

  onMaxWithdraw = () => {
    this.setState({ toWithdraw: this.state.staked });
  };

  render() {
    if (this.token === null) {
      return null;
    }
    return (
      <div
        className={`farm-row-container ${
          this.state.isExpanded ? "expanded" : ""
        }`}
      >
        <div
          className="content"
          onClick={() => {
            this.setState((prevState) => ({
              isExpanded: !prevState.isExpanded,
            }));
          }}
        >
          <div className="row-logo">
            <img src={this.props.pool.logo} />
          </div>
          <div className="row-name">
            <div className="title">{this.token.getName()}</div>
            <div className="subtitle">{this.token.getText()}</div>
          </div>
          <div className="row-apy">
            <div className="title">APY: </div>
            <div className="value">{`${this.token.getAPY()}%`}</div>
          </div>
          <div className="row-tvl">
            <div className="title">TVL: </div>
            <div className="value">{`$${this.token.getTVL()}`}</div>
          </div>
          <div className="row-deposit">
            <div className="title">Available to deposit: </div>
            <div className="value">{this.token.getBalance()}</div>
          </div>
          <div className="row-expander">
            {this.state.isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {this.state.isExpanded && (
          <div className="expanded">
            <div className="statistics">
              <div className="title">Statistics:</div>
              <div className="stats">
                <div className="title">{`${this.token.getUnit()} Deposited:`}</div>
                <div className="value">{this.state.deposited}</div>
              </div>
              <div className="stats">
                <div className="title">Total Earnings:</div>
                <div className="value">{`${this.state.earnings} GDAO`}</div>
              </div>
              <div className="stats">
                <div className="title">Claimable Rewards:</div>
                <div className="value">{`${this.state.rewards} GDAO`}</div>
              </div>
            </div>
            <div className="fields">
              <div className="input-field">
                <div className="input-label">
                  <span>Your wallet:</span>
                  {` ${this.state.stakable} ${this.token.getUnit()}`}
                </div>
                <div className="input-container">
                  <button className="max-btn" onClick={this.onMaxDeposit}>
                    Max
                  </button>
                  <div className="input">
                    <input
                      type="number"
                      value={this.state.toDeposit}
                      onChange={(e) =>
                        this.setState({ toDeposit: e.target.value })
                      }
                      placeholder={0.0}
                    />
                  </div>
                </div>
                <button className="action-btn">{`Deposit ${this.token.getUnit()}`}</button>
              </div>
              <div className="input-field">
                <div className="input-label">
                  <span>Staked in contract:</span>
                  {` ${this.state.staked} ${this.token.getUnit()}`}
                </div>
                <div className="input-container">
                  <button className="max-btn" onClick={this.onMaxWithdraw}>
                    Max
                  </button>
                  <div className="input">
                    <input
                      type="number"
                      value={this.state.toWithdraw}
                      onChange={(e) =>
                        this.setState({ toWithdraw: e.target.value })
                      }
                      placeholder={0.0}
                    />
                  </div>
                </div>
                <button className="action-btn">{`Withdraw ${this.token.getUnit()}`}</button>
              </div>
            </div>
            <div className="claims">
              <div className="title">Available rewards:</div>
              <div className="value">{`${this.state.rewards} GDAO`}</div>
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

export default FarmRow;
