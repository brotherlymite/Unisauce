import React from 'react';

import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from '../utils/getLibrary';
import { useInactiveListener } from '../hooks/useActiveWeb3React';


interface ProviderProps {
    children: React.ReactNode | JSX.Element
}

function Web3ReactManager({children}: ProviderProps) {
    useInactiveListener();
    return <>{children}</>
}

export function Web3Provider({children}: ProviderProps) {
    return <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactManager>{children}</Web3ReactManager>
    </Web3ReactProvider>
}