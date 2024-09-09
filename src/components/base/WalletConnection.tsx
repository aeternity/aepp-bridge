import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import useWalletContext, { RequiredWallet } from 'src/hooks/useWalletContext';

const WalletConnection: React.FC<{
    requiredWallets: RequiredWallet[];
    children: React.ReactNode;
    onWalletConnectError?: (e: string) => void;
}> = ({ requiredWallets, children, onWalletConnectError }) => {
    const {
        connectAeternityWallet,
        connectEthereumWallet,
        aeternityAddress,
        ethereumAddress,
        walletConnectError,
        connecting,
    } = useWalletContext();

    useEffect(
        () => onWalletConnectError && onWalletConnectError(walletConnectError),
        [walletConnectError, onWalletConnectError],
    );

    if (requiredWallets.includes(RequiredWallet.Ethereum) && !ethereumAddress) {
        return (
            <Button disabled={connecting} fullWidth variant="contained" onClick={connectEthereumWallet}>
                Connect EVM Wallet
            </Button>
        );
    }

    if (requiredWallets.includes(RequiredWallet.Aeternity) && !aeternityAddress) {
        return (
            <Button disabled={connecting} fullWidth variant="contained" onClick={connectAeternityWallet}>
                Connect SuperHero Wallet
            </Button>
        );
    }

    return <>{children}</>;
};
export default WalletConnection;
