import { useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import * as Aeternity from 'src/services/aeternity';
import * as Ethereum from 'src/services/ethereum';
import Logger from '../services/logger';
import WalletContext from './WalletContext';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { EVM_WALLET_INSTALL_URL, SUPERHERO_WALLET_URL } from 'src/constants';

const WalletProvider: React.FC<{ children: ReactNode }> = (props) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [connecting, setConnecting] = useState(false);
    const [ethereumAddress, setEthereumAddress] = useState<string | undefined>(undefined);
    const [aeternityAddress, setAeternityAddress] = useState<string | undefined>(undefined);
    const [showAeWalletSelect, setShowAeWalletSelect] = useState(false);

    const isEthWalletDetectionEnded = useRef<boolean>(false);
    const isAeWalletDetectionEnded = useRef<boolean>(false);
    const ethereumWalletDetected = useRef<boolean>(false);
    const aeternityWalletDetected = useRef<boolean>(false);
    const aeternityWalletAddress = useRef<string | undefined>(undefined);

    useEffect(() => {
        (async function () {
            const ethereumClient = (window as any).ethereum;

            ethereumWalletDetected.current = !!ethereumClient;
            isEthWalletDetectionEnded.current = true;

            aeternityWalletDetected.current = await Aeternity.detectWallet();
            isAeWalletDetectionEnded.current = true;

            if (ethereumWalletDetected.current) {
                Ethereum.Provider.listAccounts().then((accounts) => {
                    if (accounts.length > 0) {
                        setEthereumAddress(accounts[0].address);
                    }
                });
                ethereumClient.on('accountsChanged', (accounts: any) => {
                    if (accounts.length > 0) {
                        setEthereumAddress(accounts[0]);
                    } else {
                        setEthereumAddress(undefined);
                    }
                });
            }
        })();
    }, []);

    useEffect(() => {
        // For some reason, the wallet address state is not updated properly when the ae wallet is connected
        // Therefore, we need to use a ref to store the address and update the state manually
        aeternityWalletAddress.current = aeternityAddress;
    }, [aeternityAddress]);

    const connectAeternityWallet = useCallback(async () => {
        if (aeternityWalletAddress.current) return;

        if (isAeWalletDetectionEnded.current) {
            setShowAeWalletSelect(true);
        } else {
            setTimeout(connectAeternityWallet, 100);
        }
    }, [aeternityAddress]);

    const connectEthereumWallet = useCallback(async () => {
        if (isEthWalletDetectionEnded.current) {
            if (!ethereumWalletDetected.current) {
                handleWalletConnectError('Ethereum wallet extension not found');
                return;
            }

            try {
                setConnecting(true);
                const address = await Ethereum.connect();
                setEthereumAddress(address);
            } catch (e) {
                Logger.error(e);
                handleWalletConnectError((e as Error).message);
            } finally {
                setConnecting(false);
            }
        } else {
            setTimeout(connectEthereumWallet, 100);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        if (ethereumAddress) {
            setEthereumAddress(undefined);
        } else if (aeternityAddress) {
            setAeternityAddress(undefined);
        }
    }, [ethereumAddress, aeternityAddress]);

    const handleWalletConnectError = useCallback((message: string) => {
        if (!message) return;

        const [ethWalletErr, aeWalletErr] = ['Ethereum', 'æternity'].map(
            (wallet) => `${wallet} wallet extension not found`,
        );

        enqueueSnackbar(message, {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            autoHideDuration: 4000,
            action: (key) => {
                let url = '';
                if (message === aeWalletErr) {
                    url = SUPERHERO_WALLET_URL;
                } else if (message === ethWalletErr) {
                    url = EVM_WALLET_INSTALL_URL;
                }
                if (!url) return;
                return (
                    <Button
                        variant="text"
                        color="inherit"
                        onClick={() => {
                            closeSnackbar(key);
                            (window as any).open(url, '_blank').focus();
                        }}
                    >
                        Install now
                    </Button>
                );
            },
        });
    }, []);

    return (
        <WalletContext.Provider
            value={{
                connecting,
                aeternityAddress,
                ethereumAddress,
                connectAeternityWallet,
                connectEthereumWallet,
                disconnectWallet,
                showAeWalletSelect,
                setShowAeWalletSelect,
                aeternityWalletDetected: aeternityWalletDetected.current,
                ethereumWalletDetected: ethereumWalletDetected.current,
                setConnecting,
                setAeternityAddress,
                handleWalletConnectError,
            }}
        >
            {props.children}
        </WalletContext.Provider>
    );
};

export default WalletProvider;
