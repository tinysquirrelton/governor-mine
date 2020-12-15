import React, { Component } from "react";
import Web3 from "web3";
import { toast } from "react-toastify";
import { ConnectButton, HideZeroes } from "./elements";
import { pools } from "./pools";
import Token from "./token";

import "./style.scss";

const tvl = "$130,000,000";
const supply = "10,000,000";

class Farm extends Component {
  constructor(props) {
    super(props);
    this.web3 = null;
    this.state = {
      isHidingZeroes: false,
      isDropdown: false,
      account: null,
    };
    this.getMetamask();
  }

  componentDidMount() {
    this.onAccountChange();
    this.onNetworkChange();
  }

  getMetamask = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable().then((accounts) => {
          this.connectMainnet(accounts);
        });
      } catch (err) {
        console.log(err);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3 = new Web3(Web3.currentProvider);
      try {
        await this.web3.eth.getAccounts().then((accounts) => {
          this.connectMainnet(accounts);
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  connectMainnet = async (accounts) => {
    await this.web3?.eth?.getChainId().then((x) => {
      if (x !== 1) {
        this.setState({ account: accounts[0].toString() });
      } else {
        this.setState({ account: null });
        toast.error("You need to be on the Ethereum Mainnet");
      }
    });
  };

  onAccountChange() {
    window?.ethereum?.on("accountsChanged", (accounts) => {
      if (
        accounts.length > 0 &&
        this.state.account !== accounts[0].toString()
      ) {
        this.setState({ account: accounts[0].toString() });
      } else {
        this.setState({ account: null });
      }
    });
  }

  onNetworkChange() {
    window?.ethereum?.on("chainChanged", (chainId) => window.location.reload());
  }

  setConnection = () => {
    if (this.web3.utils.isAddress(this.state.account) | this.state.isDropdown) {
      this.setState((prevState) => ({ isDropdown: !prevState.isDropdown }));
    } else {
      this.getMetamask();
    }
  };

  setDisconnection = () => {
    this.web3 = null;
    this.setState({ account: null, isDropdown: false });
  };

  onHideZeroes = () => {
    this.setState((prevState) => ({
      isHidingZeroes: !prevState.isHidingZeroes,
    }));
  };

  render() {
    return (
      <div className="max-width-container">
        <div className="farm-container">
          <div className="farm-title">
            {this.props.isLarge && <div className="title-text">GDAO Farm</div>}
            <ConnectButton
              account={this.state.account}
              isDropdown={this.state.isDropdown}
              setConnection={this.setConnection}
              setDisconnection={this.setDisconnection}
            />
            {!this.props.isLarge && <div className="title-text">GDAO Farm</div>}
          </div>
          <div className="farm-subtitle">{`TVL: ${tvl}`}</div>
          <div className="farm-subtitle">{`Circulating Supply: ${supply}`}</div>
          <HideZeroes
            isHidingZeroes={this.state.isHidingZeroes}
            onHideZeroes={this.onHideZeroes}
          />
          {pools.map((pool, index) => (
            <Token
              key={index}
              pool={pool}
              web3={this.web3}
              account={this.state.account}
            />
          ))}
        </div>
        <div className="gdao-texture-bg" />
        <div className="gdao-phoenix-bg" />
      </div>
    );
  }
}

export default Farm;
