import React from "react";
import UniSauceABI from '../types/unisauce_abi.json';
import { Connection } from "container/connection";
import { BigNumber, Contract, ethers } from "ethers";
import { useContractCall } from "./useContractCall";
import { Transaction } from "container/Transaction";

const CONTRACT_ADDRESS = "0xcA579952F0f54846BADd2b089910768f453D0A4F";

interface InitialState {
    price: ethers.BigNumber;
    premium: ethers.BigNumber;
    isActivated: boolean; 
    expiry: ethers.BigNumber;
    seller: string;
    strikePrice: ethers.BigNumber;
    tokenId: ethers.BigNumber;
    collateral: ethers.BigNumber;
    buyer: string;
}
const useUniSauce = () => {
    const { ethProvider, signer} = Connection.useContainer();
    const {executeWithCustomGasLimit} = Transaction.useContainer();
    const [state, setState] = React.useState<InitialState>({
        price: BigNumber.from("0"),
        premium: BigNumber.from("0"),
        collateral: BigNumber.from("0"),
        isActivated: false,
        expiry: BigNumber.from("0"),
        seller: '',
        strikePrice: BigNumber.from("0"),
        tokenId:  BigNumber.from("0"),
        buyer: ''
    })

    const getData = React.useCallback(async () => {
        try {
            const contract = new Contract(CONTRACT_ADDRESS, UniSauceABI.abi, ethProvider);
            const price = await contract.functions.getPrice();
            const optionDetails = await contract.functions.getOptionDetails();
            setState(prev => ({
                ...prev,
                collateral: BigNumber.from("1"),
                seller: optionDetails.option.seller,
                strikePrice: optionDetails.option.strikePrice,
                buyer: optionDetails.option.buyer,
                premium: optionDetails.option.premium,
                price,
            }))
        } catch(error) {
            console.log("Error in getData", error);
        }
    }, [ethProvider]);

    React.useEffect(() => {
        getData();
    }, [getData])

    const buyCoveredCall = useContractCall(
        async () => {
          const contract =  new Contract(CONTRACT_ADDRESS, UniSauceABI.abi, ethProvider);
          const receipt = await executeWithCustomGasLimit(
            contract!.connect(signer),
            "buyCoveredCall",
            [],
            BigNumber.from(4000000) // gas limit hardcoded to avoid reverting
          );
            await getData();
          return receipt;
        },
        []
      );

    const exerciseCoveredCall = useContractCall(
    async () => {
        const contract =  new Contract(CONTRACT_ADDRESS, UniSauceABI.abi, ethProvider);
        const receipt = await executeWithCustomGasLimit(
        contract!.connect(signer),
        "exerciseCoveredCall",
        [],
        BigNumber.from(4000000) // gas limit hardcoded to avoid reverting
        );
        console.log(receipt);
        return receipt;
    },
    []
    );

    return {
        state: {
            ...state
        },
        actions: {
            buyCoveredCall,
            exerciseCoveredCall
        }
    }
}

export default useUniSauce;
