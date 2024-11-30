import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import useWalletContext, { RequiredWallet } from 'src/hooks/useWalletContext';
import { Box } from '@mui/material';

const WalletConnection: React.FC<{
    children?: React.ReactNode;
    requiredWallets: RequiredWallet[];
    messageView?: React.ReactNode;
    wrapperProps?: React.ComponentProps<typeof Box>;
    buttonProps?: React.ComponentProps<typeof Button>;
}> = ({ requiredWallets, children, buttonProps, messageView, wrapperProps }) => {
    const { connectAeternityWallet, connectEthereumWallet, aeternityAddress, ethereumAddress, connecting } =
        useWalletContext();
    let content = [];
    let shouldShowConnectButton = true;

    if (requiredWallets.includes(RequiredWallet.Ethereum) && !ethereumAddress) {
        content.push(
            <Button
                key={'ethereum-wallet-button'}
                disabled={connecting}
                fullWidth
                variant="contained"
                onClick={connectEthereumWallet}
                {...buttonProps}
            >
                Connect Ethereum Wallet
            </Button>,
        );
    }

    if (requiredWallets.includes(RequiredWallet.Aeternity) && !aeternityAddress) {
        content.push(
            <Button
                key={'aeternity-wallet-button'}
                disabled={connecting}
                fullWidth
                variant="contained"
                onClick={connectAeternityWallet}
                {...buttonProps}
            >
                Connect æternity Wallet
            </Button>,
        );
    }

    if (content.length === 0) {
        shouldShowConnectButton = false;
        content.push(children);
    }

    return shouldShowConnectButton && wrapperProps ? (
        <Box {...wrapperProps}>
            {shouldShowConnectButton && messageView}
            {content}
        </Box>
    ) : (
        <>{content}</>
    );
};

export default WalletConnection;
