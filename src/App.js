import React, { Component } from "react";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { X } from "react-feather";
import W3C from "./data/web3/class";
import Token from "./data/token/class";
import { pools } from "./data/token/pools";

const Close = ({ closeToast }) => <X size={20} onClick={closeToast} />;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.w3 = new W3C();
    this.tokens = this.getTokens();
    this.state = {
      isSmall: null,
      isMedium: null,
      isLarge: null,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();
    this.w3.onAccountChange();
    this.w3.onNetworkChange();
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
        new Token(pool.address, pool.name, pool.text, pool.unit, pool.logo)
    );
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
          isSmall={this.state.isSmall}
          isMedium={this.state.isMedium}
          isLarge={this.state.isLarge}
        />
      </div>
    );
  }
}
