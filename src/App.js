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
  GDAOAddress,
  AirdropAddress,
  MinesAddress,
  AirdropRewardAddresss,
  BurnPurgatoryAddress,
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
    this.circulatingSupply = 0;
    this.state = { isConnected: false };
  }

  async componentDidMount() {
    let chainId;

    // Init Web3
    const isConnected = await this.w3.setConnection();
    this.w3.onAccountChange(this.setChanged);
    this.w3.onNetworkChange();

    // Get contracts to derive from
    if (this.w3.web3 !== null) {
      this.wethContract = this.getContract(this.w3, wETHAddress);
      this.usdcContract = this.getContract(this.w3, USDCAddress);
      this.gdaoContract = this.getContract(this.w3, GDAOAddress);
      this.farmContract = this.getContractFarm(this.w3, farmAddress);
      // Init Token Contracts if Mainnet or Test-mode enabled
      chainId = await this.w3.web3.eth.getChainId();
      // Calculate circulating supply
      this.circulatingSupply = this.getCirculatingSupply();
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
          await token.getApprovedAmount(this.w3, token.address, farmAddress);
        }
      });
      await Promise.all(tasks);
      this.setState({ isConnected: isConnected });
    }
  }

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

  getCirculatingSupply = async () => {
    let totalSupply =
      (await this.gdaoContract.methods.totalSupply().call()) / 10 ** 18;
    let airdropUnclaimed =
      (await this.gdaoContract.methods.balanceOf(AirdropAddress).call()) /
      10 ** 18;
    let minesBalance =
      (await this.gdaoContract.methods.balanceOf(MinesAddress).call()) /
      10 ** 18;
    let airdropRewardBalance =
      (await this.gdaoContract.methods
        .balanceOf(AirdropRewardAddresss)
        .call()) /
      10 ** 18;
    let burnPurgatoryBalance =
      (await this.gdaoContract.methods.balanceOf(BurnPurgatoryAddress).call()) /
      10 ** 18;
    this.circulatingSupply = Number(
      (
        totalSupply -
        airdropUnclaimed -
        minesBalance -
        airdropRewardBalance -
        burnPurgatoryBalance
      ).toFixed(0)
    ).toLocaleString();
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
        await token.getApprovedAmount(this.w3, token.address, farmAddress);
		console.log(token.approved);
      });
      await Promise.all(tasks);
      this.setState({ isConnected: true });
    }
  };

  render() {
    return (
      <>
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
          circulatingSupply={this.circulatingSupply}
          farmContract={this.farmContract}
          isConnected={this.state.isConnected}
          isSmall={this.state.isSmall}
          isMedium={this.state.isMedium}
          isLarge={this.state.isLarge}
        />
      </>
    );
  }
}
