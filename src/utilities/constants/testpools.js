import Logo from "../../assets/logos/governor-plain.png";
import WBTC from "../../assets/coins/wbtc.png";
import WETH from "../../assets/coins/weth.png";
import UNI from "../../assets/coins/uni.png";
import LINK from "../../assets/coins/link.png";

export const testpools = [
  {
    logo: Logo,
    name: "GDAO / ETH",
    text: "GDAO / ETH LP",
    unit: "UNI-LP",
    address: "0xb354b410071a12b5ccb28bd3275a44c6dc9dbc61",
    lpAddress: "0xb354b410071a12b5ccB28Bd3275A44C6Dc9DBC61",
    pid: "0",
  },
  {
    logo: WBTC,
    name: "WBTC",
    text: "Wrapped Bitcoin",
    unit: "WBTC",
    address: "0x577D296678535e4903D59A4C929B718e1D575e0A",
    lpAddress: "0x937959382d811bd84463b3d1d221fa093930dd05",
    pid: "1",
  },
  {
    logo: WETH,
    name: "WETH",
    text: "Wrapped Ethereum",
    unit: "WETH",
    address: "0xc778417e063141139fce010982780140aa0cd5ab",
    lpAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
    pid: "3",
  },
  {
    logo: LINK,
    name: "LINK",
    text: "Chainlink",
    unit: "LINK",
    address: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    lpAddress: "0x0d1e5112B7Bf0595837f6e19A8233e8b918Ef3aA",
    pid: "4",
  },
  {
    logo: UNI,
    name: "UNI",
    text: "Uniswap",
    unit: "UNI",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    lpAddress: "0x4E99615101cCBB83A462dC4DE2bc1362EF1365e5",
    pid: "5",
  },
];
