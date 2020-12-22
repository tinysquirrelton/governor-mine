import React, { Component } from "react";
import { ConnectButton } from "./elements/connectButton";
import { HideZeroes } from "./elements/hideZeroes";
import Pool from "./elements/pool";
import { roundValue } from "../../utilities/helpers";
import "./style.scss";

export default class Farm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideZeroes: false,
    };
  }

  updateState = () => {
    this.setState({});
  };

  toggleZeroes = () => {
    this.setState((prevState) => ({
      hideZeroes: !prevState.hideZeroes,
    }));
  };

  getTVL = () => {
    let tvl = 0;
    this.props.tokens.forEach((token) => (tvl += token.tvl));
    return tvl;
  };

  render() {
    const tvl = this.getTVL();
    const Pools = () => {
      return this.props.tokens.map((token, index) => {
        if (
          this.state.hideZeroes === true &&
          (token.depositable === null || token.depositable === 0) &&
          (token.deposited === null || token.deposited === 0)
        ) {
          return null;
        } else {
          return <Pool key={index} token={token} {...this.props} />;
        }
      });
    };

    return (
      <div className="max-width-container">
        <div className="farm-container">
          <div className="farm-title">
            {this.props.isLarge && <div className="title-text">GDAO Mine</div>}
            <ConnectButton w3={this.props.w3} />
            {!this.props.isLarge && <div className="title-text">GDAO Mine</div>}
          </div>
          <div className="farm-subtitle">{`TVL: ${
            this.props.isConnected ? `$${roundValue(tvl)}` : "-"
          }`}</div>
          <div className="farm-subtitle">{`Circulating Supply: ${this.props.circulatingSupply}`}</div>
          <HideZeroes
            hideZeroes={this.state.hideZeroes}
            toggleZeroes={this.toggleZeroes}
          />
          <Pools />
        </div>
        <div className="gdao-texture-bg" />
        <div className="gdao-phoenix-bg" />
      </div>
    );
  }
}
