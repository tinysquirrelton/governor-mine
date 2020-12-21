import React, { Component } from "react";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { X } from "react-feather";
import W3C from "./data/web3/class";
import Token from "./data/token/class";
import { pools } from "./utilities/constants/constants";
import ERC20 from "./data/token/abi/ERC20.json";
import FarmABI from "./data/token/abi/FarmABI.json";

import {
  wETHAddress,
  USDCAddress,
  farmAddress,
  testnet,
} from "./utilities/constants/constants";

const Close = ({ closeToast }) => <X size={20} onClick={closeToast} />;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.w3 = new W3C();
    this.tokens = this.getTokens();
    this.wethContract = null;
    this.usdcContract = null;
    this.farmContract = null;
    this.state = {
      isSmall: null,
      isMedium: null,
      isLarge: null,
      isConnected: false,
    };
  }

  async componentDidMount() {
    let chainId;
    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();

    // Init Web3
    const isConnected = await this.w3.setConnection();
    this.w3.onAccountChange(this.setChanged);
    this.w3.onNetworkChange();

    // Get contracts to derive from
    if (this.w3.web3 !== null) {
      this.wethContract = this.getContract(this.w3, wETHAddress);
      this.usdcContract = this.getContract(this.w3, USDCAddress);
      this.farmContract = this.getContractFarm(this.w3, farmAddress);
      // Init Token Contracts if Mainnet or Test-mode enabled
      chainId = await this.w3.web3.eth.getChainId();
    }

    if (
      chainId === 1 ||
      (testnet && this.wethContract !== null && this.usdcContract !== null)
    ) {
      const tasks = this.tokens.map(async (token) => {
        await token.getContract(this.w3);
        await token.getLPContract(this.w3);
        await token.getPrice(this.w3, this.wethContract, this.usdcContract);
        await token.getAPY(this.w3, this.wethContract, this.usdcContract);
        await token.getTVL(this.w3);
        if (isConnected && this.farmContract !== null) {
          await token.getDepositable(this.w3);
          await token.getDeposited(this.w3, this.farmContract);
          await token.getPendingGDAO(this.w3, this.farmContract);
        }
      });
      await Promise.all(tasks);
      this.setState({ isConnected: isConnected });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize());
  }

  onResize = () => {
    this.setState({
      isLarge: window.innerWidth >= 992,
      isMedium: window.innerWidth >= 768 && window.innerWidth < 992,
      isSmall: window.innerWidth < 768,
    });
  };

  getTokens = () => {
    return pools.map(
      (pool) =>
        new Token(
          pool.address,
          pool.lpAddress,
          pool.name,
          pool.text,
          pool.unit,
          pool.logo,
          pool.pid
        )
    );
  };

  getContract = (w3, address) => {
    return new w3.web3.eth.Contract(ERC20.abi, address);
  };

  getContractFarm = (w3, address) => {
    return new w3.web3.eth.Contract(FarmABI.abi, address);
  };

  setChanged = async (changeType) => {
    if (changeType === "DISCONNECTED") {
      this.tokens.forEach((token) => {
        token.depositable = null;
        token.deposited = null;
        token.rewards = null;
      });
      this.setState({ isConnected: false });
    } else if (changeType === "CHANGED_ACCOUNT") {
      const tasks = this.tokens.map(async (token) => {
        await token.getDepositable(this.w3);
        await token.getDeposited(this.w3, this.farmContract);
        await token.getPendingGDAO(this.w3, this.farmContract);
      });
      await Promise.all(tasks);
      this.setState({ isConnected: true });
    }
  };

  render() {
    return (
      <div>
        <ToastContainer
          position={"bottom-right"}
          autoClose={3000}
          closeButton={<Close />}
          pauseOnFocusLoss={false}
          draggable={true}
          draggablePercent={25}
        />
        <Routes
          w3={this.w3}
          tokens={this.tokens}
          farmContract={this.farmContract}
          isConnected={this.state.isConnected}
          isSmall={this.state.isSmall}
          isMedium={this.state.isMedium}
          isLarge={this.state.isLarge}
        />
      </div>
    );
  }
}
