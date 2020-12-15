import React, { Component } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import "./style.scss";

class FarmBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: null,
      deposited: null,
      earnings: null,
      rewards: null,
      stakable: null,
      staked: null,
      toDeposit: 0.0,
      toWithdraw: 0.0,
    };
  }

  componentDidMount() {
    this.setState({
      deposited: 17.2,
      earnings: 9,
      rewards: 100,
      stakable: 1231,
      staked: 665,
    });
  }

  onMaxDeposit = () => {
    this.setState({ toDeposit: this.state.stakable });
  };

  onMaxWithdraw = () => {
    this.setState({ toWithdraw: this.state.staked });
  };

  render() {
    return (
      <div
        className={`farm-box-container ${
          this.state.isExpanded ? "expanded" : ""
        }`}
      >
        <div
          className="upper"
          onClick={() => {
            this.setState((prevState) => ({
              isExpanded: !prevState.isExpanded,
            }));
          }}
        >
          <div className="box-logo">
            <img src={this.props.logo} />
          </div>
          <div className="box-name">
            <div className="title">{this.props.pair[1]}</div>
            <div className="subtitle">{this.props.pair[0]}</div>
          </div>
          <div className="box-expander">
            {this.state.isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        <div className="lower">
          <div className="stats">
            <div className="title">APY: </div>
            <div className="value">{`${this.props.apy}%`}</div>
          </div>
          <div className="stats">
            <div className="title">TVL: </div>
            <div className="value">{`$${this.props.tvl}`}</div>
          </div>
        </div>
        {this.state.isExpanded && (
          <div className="expanded">
            <div className="statistics">
              <div className="title">Statistics</div>
              <div className="stats">
                <div className="title">{`${this.props.unit} Deposited:`}</div>
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
              <>
                <div className="input-label">
                  <span>Your wallet:</span>
                  {` ${this.state.stakable} ${this.props.unit}`}
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
                <button className="action-btn">{`Deposit ${this.props.unit}`}</button>
              </>
              <>
                <div className="input-label">
                  <span>Staked in contract:</span>
                  {` ${this.state.staked} ${this.props.unit}`}
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
                <button className="action-btn">{`Withdraw ${this.props.unit}`}</button>
              </>
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

export default FarmBox;
