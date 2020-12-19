import Web3 from "web3";
import { toast } from "react-toastify";

export default class W3C {
  constructor() {
    this.web3 = null;
    this.isConnected = false;
    this.address = null;
  }

  async getWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      try {
        let accounts = await window.ethereum.enable();
        await this.getConnection(accounts);
      } catch (err) {
        toast.error(err);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3 = new Web3(Web3.currentProvider);
      try {
        let accounts = await this.web3.eth.getAccounts();
        await this.getConnection(accounts);
      } catch (err) {
        toast.error(err);
      }
    } else {
      toast.error(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async getConnection(accounts) {
    await this.web3?.eth?.getChainId().then((x) => {
      if (x == 1) {
        this.isConnected = true;
        this.address = accounts[0].toString();
      } else {
        this.isConnected = false;
        this.address = null;
        toast.error("You need to be on the Ethereum Mainnet");
      }
    });
  }

  async setConnect(updateState = null) {
    await this.getWeb3();
    if (this.isAddressValid()) {
      if (updateState !== null) {
        // Updates the state of the component this class is used in
        updateState();
      }
    }
  }

  setDisconnect(updateState = null) {
    this.web3 = null;
    this.isConnected = false;
    this.address = null;

    if (updateState !== null) {
      // Updates the state of the component this class is used in
      updateState();
    }
  }

  onAccountChange() {
    window?.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts.length > 0 && this.address !== accounts[0].toString()) {
        this.address = accounts[0].toString();
      } else {
        this.address = null;
      }
    });
  }

  onNetworkChange() {
    window?.ethereum?.on("chainChanged", (chainId) => window.location.reload());
  }

  isAddressValid(address = this.address) {
    if (this.web3 !== null) {
      return this.web3.utils.isAddress(address);
    } else {
      return false;
    }
  }

  getWeiToETH(balance) {
    return this.web3.utils.fromWei(balance, "ether").substring(0, 10);
  }
}
