import React, { Component } from "react";
import { ConnectButton } from "./elements/connectButton";
import { HideZeroes } from "./elements/hideZeroes";
import Pool from "./elements/pool";
import "./style.scss";

const tvl = "$130,000,000";
const supply = "10,000,000";

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

  render() {
    const Pools = () => {
      return this.props.tokens.map((token, index) => {
        if (
          this.state.hideZeroes === true &&
          token.depositable === null &&
          token.deposited === null
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
            {this.props.isLarge && <div className="title-text">GDAO Farm</div>}
            <ConnectButton w3={this.props.w3} />
            {!this.props.isLarge && <div className="title-text">GDAO Farm</div>}
          </div>
          <div className="farm-subtitle">{`TVL: ${tvl}`}</div>
          <div className="farm-subtitle">{`Circulating Supply: ${supply}`}</div>
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
