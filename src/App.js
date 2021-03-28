import React, { Component } from "react";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { X } from "react-feather";
import Token from "./data/token/class";
import { pools } from "./utilities/constants/constants";
import ERC20 from "./data/token/abi/ERC20.json";
import FarmABI from "./data/token/abi/FarmABI.json";
import BigNumber from "bignumber.js/bignumber";

import WalletConnect from "./governor-common/components/walletconnect/WalletConnect";

import {
  wETHAddress,
  USDCAddress,
  farmAddress,
  GDAOAddress,
  AirdropAddress,
  MinesAddress,
  AirdropRewardAddresss,
  BurnPurgatoryAddress,
} from "./utilities/constants/constants";

const Close = ({ closeToast }) => <X size={20} onClick={closeToast} />;
BigNumber.config({ DECIMAL_PLACES: 4 });

export default class App extends Component {
  constructor(props) {
    super(props);
    this.tokens = this.getTokens();
    this.wethContract = null;
    this.usdcContract = null;
    this.farmContract = null;
    this.state = {
      circulatingSupply: 0,
    };
    this.walletconnect = null;
    this.web3 = null;
  }

  async componentDidMount() {
    this.walletconnect = await new WalletConnect(
      this.onConnect,
      this.onResetConnect
    );
    await this.walletconnect.connectWeb3();
    this.web3 = await this.walletconnect.getWeb3();

    this.getMineStats();
    let self = this;
    this.statsInterval = setInterval(function () {
      self.getMineStats();
    }, 5000);
  }

  onConnect = async (web3) => {
    const cAddresses = [wETHAddress, USDCAddress, GDAOAddress, farmAddress];

    const [wethC, ussdcC, gdaoC, farmC] = await Promise.all(
      cAddresses.map(async (c) => {
        let contract;
        if (c !== farmAddress) {
          contract = await this.getContract(web3, c);
        } else {
          contract = await this.getContractFarm(web3, c);
        }
        return contract;
      })
    );

    this.wethContract = wethC;
    this.usdcContract = ussdcC;
    this.gdaoContract = gdaoC;
    this.farmContract = await farmC;
    await this.getCirculatingSupply();
  };

  onResetConnect = () => {
    this.tokens.forEach((token) => {
      token.depositable = null;
      token.deposited = null;
      token.rewards = null;
    });
    this.setState({});
  };

  getMineStats = async () => {
    if (
      this.web3 != null &&
      this.walletconnect?.account != null &&
      this.web3?.utils.isAddress(this.walletconnect?.account)
    ) {
      let account = this.walletconnect?.account;
      const tasks = this.tokens.map(async (token) => {
        if (token.contract === null) {
          await token.getContract(this.web3);
        }
        if (token.lpContract === null) {
          await token.getLPContract(this.web3);
        }
        await token.getPrice(this.web3, this.wethContract, this.usdcContract);
        await token.getAPY(this.web3, this.wethContract, this.usdcContract);
        await token.getTVL(this.web3);
        if (this.walletconnect?.isConnected && this.farmContract !== null) {
          await token.getDepositable(this.web3, account);
          await token.getDeposited(this.web3, this.farmContract, account);
          await token.getPendingGDAO(this.web3, this.farmContract, account);
          await token.getApprovedAmount(
            this.web3,
            token.address,
            farmAddress,
            account
          );
        }
      });
      await Promise.all(tasks);
    }
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

  getContract = (web3, address) => {
    return new web3.eth.Contract(ERC20.abi, address);
  };

  getContractFarm = (web3, address) => {
    return new web3.eth.Contract(FarmABI.abi, address);
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
    let circSupply = Number(
      (
        totalSupply -
        airdropUnclaimed -
        minesBalance -
        airdropRewardBalance -
        burnPurgatoryBalance
      ).toFixed(0)
    ).toLocaleString();
    this.setState({ circulatingSupply: circSupply });
  };

  getTokenValues = async (token) => {
    let account = this.walletconnect?.account;
    await token.getDepositable(this.web3, account);
    await token.getDeposited(this.web3, this.farmContract, account);
    await token.getPendingGDAO(this.web3, this.farmContract, account);
    await token.getApprovedAmount(
      this.web3,
      token.address,
      farmAddress,
      account
    );
    this.setState({});
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
          w3={this.web3}
          tokens={this.tokens}
          getTokenValues={this.getTokenValues}
          getMineStats={this.getMineStats}
          circulatingSupply={this.circulatingSupply}
          farmContract={this.farmContract}
          walletconnect={this.walletconnect}
        />
      </>
    );
  }
}
