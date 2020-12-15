import React, { Component } from "react";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { X } from "react-feather";

const Close = ({ closeToast }) => <X size={20} onClick={closeToast} />;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.wallet = null;
    this.state = {
      isSmall: null,
      isMedium: null,
      isLarge: null,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();
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
          isSmall={this.state.isSmall}
          isMedium={this.state.isMedium}
          isLarge={this.state.isLarge}
        />
      </div>
    );
  }
}
