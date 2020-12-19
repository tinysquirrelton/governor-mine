import { minABI } from "./minABI";

export default class Token {
  constructor(address, name, text, unit, logo) {
    this.address = address;
    this.name = name;
    this.text = text;
    this.unit = unit;
    this.logo = logo;
    // Values below will be fetched
    this.contract = null;
    this.depositable = null;

    this.deposited = null;
    this.earnings = null;
    this.rewards = null;
    this.apy = null;
    this.tvl = null;
  }

  async getContract(w3) {
    if (w3.isAddressValid(this.address)) {
      this.contract = await new w3.web3.eth.Contract(minABI, this.address);
    }
  }

  async getBalance(w3) {
    if (w3.isAddressValid()) {
      let b = await this.contract.methods.balanceOf(w3.address).call();
      this.depositable = w3.getWeiToETH(b);
    }
  }
}
