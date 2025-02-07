import { useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import * as Aeternity from 'src/services/aeternity';
import WalletContext from './WalletContext';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { EVM_WALLET_INSTALL_URL, SUPERHERO_WALLET_URL } from 'src/constants';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';

const WalletProvider: React.FC<{ children: ReactNode }> = (props) => {
    const { open } = useAppKit();
    const { disconnect } = useDisconnect();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [connecting, setConnecting] = useState(false);
    const { address: ethereumAddress } = useAppKitAccount();
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
        open({
            view: 'Connect',
        });
    }, []);

    const disconnectWallet = useCallback(() => {
        if (ethereumAddress) {
            disconnect();
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
