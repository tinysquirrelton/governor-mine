import BigNumber from "bignumber.js/bignumber";

import ERC20 from "./abi/ERC20.json";
import {
  testnet,
  USDCWETHAddress,
  GDAOAddress,
  GDAOWETHLPAddress,
  farmAddress,
} from "../../utilities/constants/constants";

export default class Token {
  constructor(address, lpAddress, name, text, unit, logo, pid) {
    this.address = address;
    this.lpAddress = lpAddress;
    this.farmAddress = farmAddress;
    this.name = name;
    this.text = text;
    this.unit = unit;
    this.logo = logo;
    this.pid = pid;
    // Values below will be fetched
    this.contract = null;
    this.lpContract = null;
    this.price = null;
    this.apy = null;
    this.tvl = null;
    // Values below will be nullified on account change/disconnect
    this.depositable = null;
    this.deposited = null;
    this.rewards = null;
    this.approved = 0;
  }

  async getContract(web3) {
    if (web3?.utils.isAddress(this.address)) {
      this.contract = await new web3.eth.Contract(ERC20.abi, this.address);
    }
  }

  async getLPContract(web3) {
    if (web3?.utils.isAddress(this.address)) {
      this.lpContract = await new web3.eth.Contract(ERC20.abi, this.lpAddress);
    }
  }

  getWeiToETH(web3, balance) {
    return BigNumber(web3.utils.fromWei(balance, "ether")).toNumber();
  }

  getWeiToETHString(web3, balance) {
    return BigNumber(web3.utils.fromWei(balance, "ether")).toString(10);
  }

  //////

  async getPrice(web3, wethContract, usdcContract) {
    if (web3?.utils.isAddress(this.lpAddress)) {
      let p;
      let xB;
      let w = await wethContract.methods.balanceOf(this.lpAddress).call();
      let wB = await this.getWeiToETH(web3, w);

      if (this.name === "GDAO / ETH") {
        let wB2x = wB * 2; // 2x number of WETH in (GDAO-WETH)
        let tS = await this.lpContract.methods.totalSupply().call(); // Total Supply of (GDAO-WETH)
        let tSB = await this.getWeiToETH(web3, tS);
        p = wB2x / tSB; // Price in ETH
      } else {
        let x = await this.contract.methods.balanceOf(this.lpAddress).call();
        if (["USDC", "WBTC"].includes(this.name)) {
          x = BigNumber(x).toNumber();
        }
        if (this.name === "USDC") {
          xB = x / 10 ** 6;
        } else if (this.name === "WBTC") {
          xB = x / 10 ** 8;
        } else {
          xB = await this.getWeiToETH(web3, x);
        }
        p = wB / xB; // Price in ETH
      }

      if (testnet) {
        this.price = p * 650;
      } else {
        let i = await wethContract.methods.balanceOf(USDCWETHAddress).call();
        let iB = await this.getWeiToETH(web3, i);
        let j = BigNumber(
          await usdcContract.methods.balanceOf(USDCWETHAddress).call()
        ).toNumber();
        let jB = j / 10 ** 6;
        let ijP = jB / iB; // Price of WETH in USDC
        this.price = p * ijP; // Price of Token in USDC
      }
    }
  }

  async getAPY(web3, wethContract, usdcContract) {
    if (web3?.utils.isAddress(this.address)) {
      let bB;
      const gdaoPrice = await this.getGDAOPrice(
        web3,
        wethContract,
        usdcContract
      );
      const xBy = this.name === "GDAO / ETH" ? 400000 : 100000;
      let b = await this.contract.methods.balanceOf(farmAddress).call();

      if (("USDC", "WBTC".includes(this.name))) {
        b = BigNumber(b).toNumber();
      }
      if (this.name === "USDC") {
        bB = b / 10 ** 6;
      } else if (this.name === "WBTC") {
        bB = b / 10 ** 8;
      } else {
        bB = await this.getWeiToETH(web3, b);
      }

      let n = gdaoPrice * xBy;
      let d = this.price * bB;
      this.apy = (n / d) * 2 * 100;
    }
  }

  async getGDAOPrice(web3, wethContract, usdcContract) {
    let w = await wethContract.methods.balanceOf(GDAOWETHLPAddress).call();
    let wB = await this.getWeiToETH(web3, w);

    let GDAOContract = await new web3.eth.Contract(ERC20.abi, GDAOAddress);
    let g = await GDAOContract.methods.balanceOf(GDAOWETHLPAddress).call();
    let gB = await this.getWeiToETH(web3, g);
    let p = wB / gB; // Price in ETH

    if (testnet) {
      return p * 650;
    } else {
      let i = await wethContract.methods.balanceOf(USDCWETHAddress).call();
      let iB = await this.getWeiToETH(web3, i);
      let j = BigNumber(
        await usdcContract.methods.balanceOf(USDCWETHAddress).call()
      ).toNumber();
      let jB = j / 10 ** 6;
      let ijP = jB / iB; // Price of WETH in USDC
      let price = p * ijP; // Price of Token in USDC
      return price;
    }
  }

  async getTVL(web3) {
    if (web3?.utils.isAddress(this.address)) {
      let bB;
      let b = await this.contract.methods.balanceOf(farmAddress).call();
      if (("USDC", "WBTC".includes(this.name))) {
        b = BigNumber(b).toNumber();
      }
      if (this.name === "USDC") {
        bB = b / 10 ** 6;
      } else if (this.name === "WBTC") {
        bB = b / 10 ** 8;
      } else {
        bB = await this.getWeiToETH(web3, b);
      }
      this.tvl = bB * this.price;
    }
  }

  async getDepositable(web3, account) {
    if (web3?.utils.isAddress(account) && web3?.utils.isAddress(this.address)) {
      let b = await this.contract.methods.balanceOf(account).call();
      // let bB;
      // if (this.name === "USDC") {
      //   bB = b / 10 ** 6;
      // } else if (this.name === "WBTC") {
      //   bB = b / 10 ** 8;
      // } else {
      //   bB = await this.getWeiToETH(web3, b.toString());
      // }
      this.depositable = b;
    }
  }

  async getDeposited(web3, farmContract, account) {
    if (web3?.utils.isAddress(account)) {
      let b = await farmContract.methods.userInfo(this.pid, account).call();
      //let bB;
      // if (this.name === "USDC") {
      //   bB = b.amount / 10 ** 6;
      // } else if (this.name === "WBTC") {
      //   bB = b.amount / 10 ** 8;
      // } else {
      //   bB = b.amount
      // }
      this.deposited = b.amount;
    }
  }

  async getPendingGDAO(web3, farmContract, account) {
    if (web3?.utils.isAddress(account)) {
      let b = await farmContract.methods.pendingGDAO(this.pid, account).call();
      this.rewards = await this.getWeiToETH(web3, b);
    }
  }

  async getApprovedAmount(web3, tokenAddress, farmAddress, account) {
    if (web3?.utils.isAddress(account)) {
      let GDAOContract = await new web3.eth.Contract(ERC20.abi, tokenAddress);
      let allowance = await GDAOContract.methods
        .allowance(account, farmAddress)
        .call();
      this.approved = allowance;
    }
  }
}
