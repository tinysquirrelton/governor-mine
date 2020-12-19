import React, { Component } from "react";
import "./style.scss";
import FarmRow from "./rows";
import FarmBoxes from "./boxes";

class Token extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      deposited: null,
      depositable: null,
      earnings: null,
      rewards: null,
      apy: null,
      tvl: null,
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.pool.address !== "ethereum") {
      let c = await this.getContract();
      let b = await this.getBalance(c);
    }
  }

  getContract = async () => {
    console.log("C-Web3: ", this.props.web3);
    let address = this.props.pool.address;
    if (this.props.web3?.utils.isAddress(address)) {
      let minABI = [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
      ];
      return await new this.props.web3.eth.Contract(minABI, address);
    }
  };

  getBalance = async (c) => {
    console.log("B-Web3: ", this.props.web3);
    let account = this.props.account;
    if (this.props.web3?.utils.isAddress(account)) {
      let b = await c.methods.balanceOf(account).call();
      return await this.props.web3.utils.fromWei(b, "ether").substring(0, 10);
    }
  };

  render() {
    return 1; //this.props.isLarge ? <FarmRow /> : <FarmBoxes />;
  }
}

export default Token;
