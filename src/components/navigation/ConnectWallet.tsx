import { useState } from 'react';
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';

import { Direction } from 'src/context/AppContext';
import useAppContext from 'src/hooks/useAppContext';
import useWalletContext from 'src/hooks/useWalletContext';

import EthereumIcon from 'src/components/base/icons/ethereum';
import AeternityIcon from 'src/components/base/icons/aeternity';
import { useSnackbar } from 'notistack';

const shortenAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-3)}`;
};

const WalletConnect = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { direction, ethereum, aeternity } = useAppContext();
    const {
        aeternityAddress,
        ethereumAddress,
        connectAeternityWallet,
        connectEthereumWallet,
        connecting,
        disconnectWallet,
    } = useWalletContext();

    const connectedToAeternity = direction === Direction.AeternityToEthereum && aeternityAddress;
    const connectedToEthereum = direction === Direction.EthereumToAeternity && ethereumAddress;
    const connected = connectedToAeternity || connectedToEthereum;
    const shortAddress = shortenAddress(connectedToAeternity ? aeternityAddress : ethereumAddress);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let content = <>Connect Wallet</>;
    let onClick = (event: React.MouseEvent<HTMLButtonElement>) => {};

    if (connected) {
        const showBalance = (connectedToEthereum && ethereum.balance) || (connectedToAeternity && aeternity.balance);
        content = (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {connectedToEthereum ? <EthereumIcon /> : <AeternityIcon />}
                    &nbsp;
                    {shortAddress}
                </Box>

                {showBalance && (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {connectedToEthereum ? `${ethereum.balance}Ξ` : `${aeternity.balance}Æ`}
                    </Box>
                )}
            </Box>
        );
        onClick = handleClick;
    } else {
        onClick = direction === Direction.AeternityToEthereum ? connectAeternityWallet : connectEthereumWallet;
    }

    const handleCopyAddress = () => {
        navigator.clipboard.writeText((connectedToEthereum ? ethereumAddress : aeternityAddress)!);
        enqueueSnackbar('Copied to clipboard', { variant: 'success' });
        handleClose();
    };
    const handleDisconnect = () => {
        disconnectWallet();
        handleClose();
    };

    return (
        <>
            <Button
                sx={{ display: 'flex', textTransform: 'none', fontSize: '15px' }}
                disabled={connecting}
                onClick={onClick}
            >
                {content}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleCopyAddress}>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy address</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleDisconnect}>
                    <ListItemIcon>
                        <LogoutIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'red' }}>Disconnect</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default WalletConnect;
