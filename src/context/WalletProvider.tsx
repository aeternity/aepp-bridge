import { useState, useEffect, ReactNode, useCallback } from 'react';
import * as Aeternity from 'src/services/aeternity';
import * as Ethereum from 'src/services/ethereum';
import Logger from '../services/logger';
import WalletContext from './WalletContext';

const WalletProvider: React.FC<{ children: ReactNode }> = (props) => {
    const [connecting, setConnecting] = useState(false);
    const [ethereumAddress, setEthereumAddress] = useState<string | undefined>(undefined);
    const [aeternityAddress, setAeternityAddress] = useState<string | undefined>(undefined);
    const [walletConnectError, setWalletConnectError] = useState<string>('');

    useEffect(() => {
        const ethereumClient = (window as any).ethereum;

        if (ethereumClient) {
            Ethereum.Provider.listAccounts().then((accounts) => {
                if (accounts.length > 0) {
                    setEthereumAddress(accounts[0]);
                }
            });
            ethereumClient.on('accountsChanged', (accounts: any) => {
                if (accounts.length > 0) {
                    setEthereumAddress(accounts[0]);
                } else {
                    setEthereumAddress(undefined);
                }
            });

            Aeternity.Sdk.onAddressChange = ({ current }) => {
                setAeternityAddress(Object.keys(current)[0]);
            };
        }
    }, []);

    const tryConnectToAeternityWallet = useCallback(async () => {
        try {
            const walletDetected = await Aeternity.detectWallet();
            if (walletDetected) {
                connectAeternityWallet();
            }
        } catch (e) {}
    }, []);

    const connectAeternityWallet = useCallback(async () => {
        try {
            setConnecting(true);
            const address = await Aeternity.connect();
            setAeternityAddress(address);
        } catch (e) {
            Logger.error(e);
            setWalletConnectError((e as Error).message);
        } finally {
            setConnecting(false);
        }
    }, [aeternityAddress]);

    const connectEthereumWallet = useCallback(async () => {
        if (!Ethereum.Provider) {
            setWalletConnectError('Ethereum wallet not available');
            return;
        }

        try {
            setConnecting(true);
            const address = await Ethereum.connect();
            setEthereumAddress(address);
        } catch (e) {
            Logger.error(e);
        } finally {
            setConnecting(false);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        if (ethereumAddress) {
            setEthereumAddress(undefined);
        } else if (aeternityAddress) {
            setAeternityAddress(undefined);
        }
    }, [ethereumAddress, aeternityAddress]);

    return (
        <WalletContext.Provider
            value={{
                connecting,
                aeternityAddress,
                ethereumAddress,
                connectAeternityWallet,
                connectEthereumWallet,
                walletConnectError,
                disconnectWallet,
                tryConnectToAeternityWallet,
            }}
        >
            {props.children}
        </WalletContext.Provider>
    );
};

export default WalletProvider;
