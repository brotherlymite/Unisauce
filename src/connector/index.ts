import { Web3Provider } from "@ethersproject/providers";
import { IS_MAINNET } from "../constants/stage";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { providers } from "ethers";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export enum CHAIN_ID {
  Ethereum = 1,
  Kovan = 80001,
}

const { REACT_APP_MAINNET_RPC_URL, REACT_APP_KOVAN_RPC_URL } = process.env;
// console.log(REACT_APP_MAINNET_RPC_URL)
const RPC_URLS = {
  [CHAIN_ID.Ethereum]: REACT_APP_MAINNET_RPC_URL!,
  [CHAIN_ID.Kovan]: REACT_APP_KOVAN_RPC_URL!,
};

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: IS_MAINNET ? CHAIN_ID.Ethereum : CHAIN_ID.Kovan,
});

export function getNetworkLibrary(): Web3Provider {
  const chainId = IS_MAINNET ? CHAIN_ID.Ethereum : CHAIN_ID.Kovan;
  const rpcUrl = RPC_URLS[chainId];
  return new providers.JsonRpcProvider(rpcUrl, chainId) as unknown as Web3Provider;
}

export const injected = new InjectedConnector({
  supportedChainIds: [CHAIN_ID.Ethereum, CHAIN_ID.Kovan],
});

export const walletConnect = new WalletConnectConnector({
  rpc: IS_MAINNET
    ? {
        [CHAIN_ID.Ethereum]: RPC_URLS[CHAIN_ID.Ethereum],
      }
    : { [CHAIN_ID.Kovan]: RPC_URLS[CHAIN_ID.Kovan] },
});
