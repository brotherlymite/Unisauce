import React from 'react';
import { createContainer } from 'unstated-next';
import { Provider as MulticallProvider } from 'ethers-multicall';

import { getNetworkLibrary } from '../../connector';
import { useWeb3React } from '@web3-react/core';

export const Connection = createContainer(useConnection);

const ethProvider = getNetworkLibrary();

function useConnection() {
    const { library, active, account, chainId } = useWeb3React();
    const [ethMulticallProvider, setMulticallProvider] = React.useState<MulticallProvider | null>(null);

    React.useEffect(() => {
        const _ethMulticallProvider = new MulticallProvider(ethProvider);

        Promise.all([_ethMulticallProvider.init()]).then(() => {
            setMulticallProvider(_ethMulticallProvider);
        });
    }, []);

    return {
        ethProvider,
        ethMulticallProvider,
        signer: library?.getSigner() || null,
        active,
        account: account || null,
        chainId,
    };
}
