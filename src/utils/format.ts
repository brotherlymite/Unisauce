import { ethers } from "ethers";
import BigNumber from "bignumber.js";

export function increaseByPercent(amount: ethers.BigNumber, percent: number): ethers.BigNumber {
  const amountInBN = new BigNumber(amount?.toString());
  const increasedAmount = amountInBN.plus(amountInBN?.multipliedBy(new BigNumber(percent)));
  return ethers.BigNumber.from(increasedAmount.toFixed(0));
}

export function decreaseByPercent(amount: ethers.BigNumber, percent: number): ethers.BigNumber {
  const amountInBN = new BigNumber(amount?.toString());
  const decreasedAmount = amountInBN?.minus(amountInBN?.multipliedBy(new BigNumber(percent)));
  return ethers.BigNumber.from(decreasedAmount.toFixed(0));
}

export function normalizeBignumber(amount: ethers.BigNumber, decimal: number = 18) {
  return ethers.utils.formatUnits(amount, decimal);
}
