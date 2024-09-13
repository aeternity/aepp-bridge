import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';

import { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import WalletIcon from '@mui/icons-material/Wallet';

import AeternityIcon from 'src/components/base/icons/aeternity';
import EthereumIcon from 'src/components/base/icons/ethereum';
import { Direction } from 'src/context/AppContext';
import useWalletContext, { RequiredWallet } from 'src/hooks/useWalletContext';
import useTransactionHistory, { ConnectedWallet } from 'src/hooks/useTransactionHistory';
import BridgeActionListItem from 'src/components/base/BridgeActionListItem';
import WalletConnection from 'src/components/base/WalletConnection';
import Spinner from 'src/components/base/Spinner';
import PageContainer from 'src/components/base/PageContainer';

const getRequiredWallets = (direction: Direction) => {
    switch (direction) {
        case Direction.AeternityToEthereum:
            return [RequiredWallet.Aeternity];
        case Direction.EthereumToAeternity:
            return [RequiredWallet.Ethereum];
        default:
            return [RequiredWallet.Aeternity, RequiredWallet.Ethereum];
    }
};

const TransactionHistory = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { aeternityAddress, ethereumAddress } = useWalletContext();
    const [direction, setDirection] = useState<Direction>(Direction.Both);

    const connectedWallets = useMemo<ConnectedWallet[]>(() => {
        const _connectedWallets: ConnectedWallet[] = [];

        const ethWallet = { wallet: RequiredWallet.Ethereum, address: ethereumAddress } as ConnectedWallet;
        const aeWallet = { wallet: RequiredWallet.Aeternity, address: aeternityAddress } as ConnectedWallet;

        if (direction === Direction.AeternityToEthereum) {
            aeternityAddress && _connectedWallets.push(aeWallet);
        } else if (direction === Direction.EthereumToAeternity) {
            ethereumAddress && _connectedWallets.push(ethWallet);
        } else {
            aeternityAddress && _connectedWallets.push(aeWallet);
            ethereumAddress && _connectedWallets.push(ethWallet);
        }

        return _connectedWallets;
    }, [aeternityAddress, ethereumAddress, direction]);

    const { transactions, loading } = useTransactionHistory(direction, connectedWallets);

    return (
        <PageContainer title="Transaction History">
            <Divider flexItem orientation="horizontal" sx={{ marginTop: 1, marginBottom: 2 }} />
            <Box display="flex" flexWrap={'wrap'}>
                <FormControl sx={{ marginBottom: 2 }}>
                    <InputLabel id="network-from-select-label">Network</InputLabel>
                    <Select
                        sx={{ marginRight: 1, minWidth: 160 }}
                        labelId="network-from-select-label"
                        id="network-from-select"
                        label="Network"
                        value={direction}
                        onChange={(e) => setDirection(e.target.value as Direction)}
                    >
                        <MenuItem value={Direction.Both}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SelectAllIcon /> <Box sx={{ marginLeft: 1 }}>All</Box>
                            </Box>
                        </MenuItem>
                        <MenuItem value={Direction.AeternityToEthereum}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AeternityIcon /> <Box sx={{ marginLeft: 1 }}>æternity</Box>
                            </Box>
                        </MenuItem>
                        <MenuItem value={Direction.EthereumToAeternity}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EthereumIcon /> <Box sx={{ marginLeft: 1 }}>Ethereum</Box>
                            </Box>
                        </MenuItem>
                    </Select>
                </FormControl>

                <Box
                    sx={{
                        flex: 1,
                        display: 'inline-flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        ml: 1,
                    }}
                >
                    {!!connectedWallets.length ? (
                        <Typography variant="caption" mt={-1}>
                            Connected account{connectedWallets.length > 1 ? 's' : ''}
                        </Typography>
                    ) : (
                        <Typography variant="h5">Wallet not connected</Typography>
                    )}
                    {connectedWallets.map((connected) => {
                        return (
                            <Typography
                                key={`wallet-address-${connected.wallet}`}
                                display="flex"
                                alignItems="center"
                                variant="body2"
                                mb={1}
                                gap={1}
                                onClick={(e) => {
                                    e.detail === 2 &&
                                        navigator.clipboard.writeText(connected.address).then(() =>
                                            enqueueSnackbar('Copied to clipboard', {
                                                variant: 'success',
                                            }),
                                        );
                                }}
                            >
                                {connected.wallet === RequiredWallet.Ethereum ? (
                                    <EthereumIcon height={13} width={13} />
                                ) : (
                                    <AeternityIcon height={13} width={13} />
                                )}
                                {connected.address}
                            </Typography>
                        );
                    })}
                </Box>
            </Box>
            <Divider flexItem orientation="horizontal" />
            <Box>
                <Spinner loading={loading} size={32} margin={5} />
                <WalletConnection
                    buttonProps={{ fullWidth: false, variant: 'outlined', sx: { marginBottom: 1 } }}
                    requiredWallets={getRequiredWallets(direction)}
                    wrapperProps={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 3,
                        justifyContent: 'center',
                    }}
                    messageView={
                        <>
                            <WalletIcon sx={{ width: 48, height: 48 }} />
                            <Typography variant="h6" mb={2} textAlign={'center'}>
                                Connect your wallet to view transaction history
                            </Typography>
                        </>
                    }
                >
                    {transactions.map((transaction) => (
                        <BridgeActionListItem key={transaction.hash} item={transaction} />
                    ))}
                </WalletConnection>
            </Box>
        </PageContainer>
    );
};

export default TransactionHistory;
