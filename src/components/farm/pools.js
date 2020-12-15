import Logo from "../../assets/logos/governor-plain.png";
import WBTC from "../../assets/coins/wbtc.png";
import ETH from "../../assets/coins/eth.png";
import USDC from "../../assets/coins/usdc.png";
import UNI from "../../assets/coins/uni.png";
import YFI from "../../assets/coins/yfi.png";
import SNX from "../../assets/coins/snx.png";
import AAVE from "../../assets/coins/aave.png";

export const pools = [
  {
    logo: Logo,
    name: "GDAO / ETH",
    text: "GDAO / ETH LP",
    unit: "UNI-LP",
    address: "0x4d184bf6f805ee839517164d301f0c4e5d25c374",
  },
  {
    logo: WBTC,
    name: "WBTC",
    text: "Wrapped Bitcoin",
    unit: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
  {
    logo: ETH,
    name: "ETH",
    text: "Ethereum",
    unit: "ETH",
    address: "ethereum",
  },
  {
    logo: USDC,
    name: "USDC",
    text: "USD Coin",
    unit: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  {
    logo: UNI,
    name: "UNI",
    text: "Uniswap",
    unit: "UNI",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  },
  {
    logo: YFI,
    name: "YFI",
    text: "Yearn Finance",
    unit: "YFI",
    address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
  },
  {
    logo: SNX,
    name: "SNX",
    text: "Synthetix",
    unit: "SNX",
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
  },
  {
    logo: AAVE,
    name: "AAVE",
    text: "Aave",
    unit: "AAVE",
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
  },
];
