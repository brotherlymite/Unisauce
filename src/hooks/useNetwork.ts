import { User } from "container/user";
import { ethers, providers } from "ethers";

const useNetwork = () => {
  const {
    actions: { logout },
  } = User.useContainer();
  // console.log(ethers.BigNumber.from(137).toHexString());
  const switchNetwork = async (provider: providers.Web3Provider, chainId: number) => {
    const hexChainId = "0x" + chainId.toString(16);
    // console.log(provider);
    if (!provider || !provider.provider || !provider.provider.request) return;
    try {
      await provider.provider.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch (error) {
      let params = {
        chainId: ethers.BigNumber.from(8001).toHexString(),
        chainName: "Polygon Mainnet",
        nativeCurrency: {
          name: "Polygon Matic",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: [`https://polygon-rpc.com`],
        blockExplorerUrls: ["https://polygonscan.com"],
      };

      if (params) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [params],
          });
          logout();
        } catch (addError) {
          // handle "add" error
          console.error("Add network error"); // eslint-disable-line
        }
      } else {
        throw new Error("Network not found");
      }
    }
  };

  return {
    switchNetwork,
  };
};

export default useNetwork;
