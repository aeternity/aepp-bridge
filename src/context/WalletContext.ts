import { createContext } from 'react';

export interface IWalletContext {
    aeternityAddress?: string;
    ethereumAddress?: string;
    connecting: boolean;
    connectEthereumWallet: () => Promise<void>;
    connectAeternityWallet: () => Promise<void>;
    disconnectWallet: () => void;
    showAeWalletSelect: boolean;
    setShowAeWalletSelect: (show: boolean) => void;
    aeternityWalletDetected: boolean;
    ethereumWalletDetected: boolean;
    setConnecting: (connecting: boolean) => void;
    setAeternityAddress: (address: string) => void;
    handleWalletConnectError: (message: string) => void;
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
    showAeWalletSelect: false,
    setShowAeWalletSelect: (show: boolean) => {
        // stub
    },
    aeternityWalletDetected: false,
    ethereumWalletDetected: false,
    setConnecting: (connecting: boolean) => {
        // stub
    },
    setAeternityAddress: (address: string) => {},
    handleWalletConnectError: (message: string) => {
        // stub
    },
};

const WalletContext = createContext<IWalletContext>(contextStub);

export default WalletContext;
