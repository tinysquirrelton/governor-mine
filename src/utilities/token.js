export class Token {
  constructor(name, text, unit, address) {
    this.name = name;
    this.text = text;
    this.contract = null;
    this.unit = unit;
    this.address = address;
    this.balance = "-";
    this.apy = 0;
    this.tvl = 0;
    this.staked = 0;
  }

  getName() {
    return this.name;
  }

  getText() {
    return this.text;
  }

  getUnit() {
    return this.unit;
  }

  setContract() {
    if (window?.web3?.utils?.isAddress(this.address)) {
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
      this.contract = new window.web3.eth.Contract(minABI, this.address);
    }
  }

  getContract() {
    return this.contract;
  }

  setBalance(account) {
    if (window?.web3?.utils?.isAddress(account)) {
      this.contract?.methods
        .balanceOf(account)
        .call()
        .then((balance) => {
          this.balance = window.web3.utils
            .fromWei(balance, "ether")
            .substring(0, 10);
        })
        .catch((err) => null);
    }
  }

  getBalance() {
    if (this.balance !== "-") {
      return `${this.balance} ${this.unit}`;
    } else {
      return this.balance;
    }
  }

  getAPY() {
    return this.apy;
  }

  getTVL() {
    return this.tvl;
  }
}
