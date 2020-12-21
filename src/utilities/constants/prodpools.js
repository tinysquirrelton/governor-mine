import Logo from "../../assets/logos/governor-plain.png";
import WBTC from "../../assets/coins/wbtc.png";
import WETH from "../../assets/coins/weth.png";
import USDC from "../../assets/coins/usdc.png";
import UNI from "../../assets/coins/uni.png";
import YFI from "../../assets/coins/yfi.png";
import SNX from "../../assets/coins/snx.png";
import AAVE from "../../assets/coins/aave.png";
import LINK from "../../assets/coins/link.png";

export const prodpools = [
  {
    logo: Logo,
    name: "GDAO / ETH",
    text: "GDAO / ETH LP",
    unit: "UNI-LP",
    address: "0x4D184bf6F805Ee839517164D301f0C4e5d25c374",
    lpAddress: "0x4D184bf6F805Ee839517164D301f0C4e5d25c374",
    pid: "0",
  },
  {
    logo: WBTC,
    name: "WBTC",
    text: "Wrapped Bitcoin",
    unit: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    lpAddress: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
    pid: "1",
  },
  {
    logo: WETH,
    name: "WETH",
    text: "Wrapped Ethereum",
    unit: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    lpAddress: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    pid: "2",
  },
  {
    logo: LINK,
    name: "LINK",
    text: "Chainlink",
    unit: "LINK",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    lpAddress: "0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974",
    pid: "3",
  },
  {
    logo: USDC,
    name: "USDC",
    text: "USD Coin",
    unit: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    lpAddress: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    pid: "4",
  },
  {
    logo: AAVE,
    name: "AAVE",
    text: "Aave",
    unit: "AAVE",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    lpAddress: "0xDFC14d2Af169B0D36C4EFF567Ada9b2E0CAE044f",
    pid: "5",
  },
  {
    logo: SNX,
    name: "SNX",
    text: "Synthetix",
    unit: "SNX",
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    lpAddress: "0x43AE24960e5534731Fc831386c07755A2dc33D47",
    pid: "6",
  },

  {
    logo: UNI,
    name: "UNI",
    text: "Uniswap",
    unit: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    lpAddress: "0xd3d2E2692501A5c9Ca623199D38826e513033a17",
    pid: "7",
  },
  {
    logo: YFI,
    name: "YFI",
    text: "Yearn Finance",
    unit: "YFI",
    address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    lpAddress: "0x2fDbAdf3C4D5A8666Bc06645B8358ab803996E28",
  },
];
