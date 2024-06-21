import { createContext } from 'react';

export interface IWalletContext {
    aeternityAddress?: string;
    ethereumAddress?: string;
    connecting: boolean;
    connectAeternityWallet: () => Promise<void>;
    tryConnectToAeternityWallet: () => Promise<void>;
    connectEthereumWallet: () => Promise<void>;
    disconnectWallet: () => void;
    walletConnectError: string;
}

const contextStub = {
    connecting: false,
    connectAeternityWallet: async () => {
        // stub
    },
    tryConnectToAeternityWallet: async () => {},
    connectEthereumWallet: async () => {
        // stub
    },
    disconnectWallet: async () => {
        // stub
    },
    walletConnectError: '',
};

const WalletContext = createContext<IWalletContext>(contextStub);

export default WalletContext;
