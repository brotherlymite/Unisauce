import { IS_MAINNET } from "../constants/stage";

export function getEtherscanTxLink(txId: string = "") {
  const prefix = IS_MAINNET ? "" : "kovan.";
  return `https://polygonscan.com/tx/${txId}`;
}
