import { createContext } from 'react';

export interface IWalletContext {
    aeternityAddress?: string;
    ethereumAddress?: string;
    connecting: boolean;
    connectEthereumWallet: () => Promise<void>;
    connectAeternityWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const contextStub = {
    connecting: false,
    connectAeternityWallet: async () => {
        // stub
    },
    connectEthereumWallet: async () => {
        // stub
    },
    disconnectWallet: async () => {
        // stub
    },
};

const WalletContext = createContext<IWalletContext>(contextStub);

export default WalletContext;
