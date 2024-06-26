import { useContext } from 'react';

import WalletContext, { IWalletContext } from '../context/WalletContext';

export enum RequiredWallet {
    Ethereum,
    Aeternity,
}

function useWalletContext(): IWalletContext {
    const context = useContext<IWalletContext>(WalletContext);
    if (context == null) {
        throw new Error('`useWalletContext` not available.');
    }
    return context;
}

export default useWalletContext;
