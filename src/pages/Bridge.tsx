import React from 'react';
import {
    Box,
    Breadcrumbs,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import AeternityIcon from 'src/components/base/icons/aeternity';
import EthereumIcon from 'src/components/base/icons/ethereum';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import useWalletContext, { RequiredWallet } from 'src/hooks/useWalletContext';
import useAppContext from 'src/hooks/useAppContext';
import Constants, { Asset } from 'src/constants';
import * as Aeternity from 'src/services/aeternity';
import Logger from 'src/services/logger';
import * as Ethereum from 'src/services/ethereum';
import WalletConnection from 'src/components/base/WalletConnection';
import { AeternityBridgeInfo, EVMBridgeInfo, Direction } from 'src/context/AppContext';
import Spinner from 'src/components/base/Spinner';

const BRIDGE_TOKEN_ACTION_TYPE = 0;
const BRIDGE_ETH_ACTION_TYPE = 1;
const BRIDGE_AETERNITY_ACTION_TYPE = 2;

const printBalance = (
    direction: Direction,
    asset: Asset,
    showBalance: boolean,
    ethereumInfo?: EVMBridgeInfo,
    aeternityInfo?: AeternityBridgeInfo,
) => {
    let balance = ethereumInfo?.asset?.balance;
    let symbol = asset.symbol;
    if (direction == Direction.AeternityToEthereum) {
        symbol = `æ${symbol}`;
        if (symbol === 'æWAE') {
            symbol = `AE`;
        }
        balance = aeternityInfo?.asset?.balance;
    }
    if (showBalance) {
        return `${balance ? Number(balance) / Number(10 ** asset.decimals) : 0} ${symbol}`;
    }
    return symbol;
};

const Bridge: React.FC = () => {
    const { aeternity, ethereum, assets, asset, updateAsset, direction, updateDirection } = useAppContext();
    const { aeternityAddress, ethereumAddress } = useWalletContext();
    const [error, setError] = React.useState('');
    const [buttonBusy, setButtonBusy] = React.useState(false);
    const [confirming, setConfirming] = React.useState(false);
    const [confirmingMsg, setConfirmingMsg] = React.useState('');
    const [operationHash, setOperationHash] = React.useState('');

    const [destination, setDestination] = React.useState<string>();
    const [amount, setAmount] = React.useState<string>();

    const handleDirectionChange = React.useCallback((evt: SelectChangeEvent<Direction>) => {
        updateDirection(evt.target.value as Direction);
        setDestination('');
        setAmount('');
    }, []);

    const handleAssetChange = React.useCallback((evt: SelectChangeEvent<string>) => {
        const asset = assets.find(({ symbol }) => symbol == evt.target.value);
        if (asset) {
            updateAsset(asset);
        }
    }, []);

    const handleDestination = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setDestination(e.target.value);
    }, []);

    const handleAmount = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setAmount(e.target.value);
    }, []);

    const normalizedAmount = React.useMemo(() => {
        if (!amount) {
            return 0;
        }
        return Number(amount) * 10 ** asset.decimals;
    }, [asset, amount]);

    const isValidDestination = React.useMemo(() => {
        if (!destination) {
            return false;
        }
        if (direction == Direction.AeternityToEthereum) {
            return Ethereum.isAddressValid(destination);
        }
        return Aeternity.isAddressValid(destination);
    }, [destination, direction]);

    const bridgeToAeternity = React.useCallback(async () => {
        const bridge = new Ethereum.Contract(
            Constants.ethereum.bridge_address,
            Constants.ethereum.bridge_abi,
            Ethereum.Provider.getSigner(),
        );
        const assetContract = new Ethereum.Contract(
            asset.ethAddress,
            Constants.ethereum.asset_abi,
            Ethereum.Provider.getSigner(),
        );
        if (!isValidDestination || !destination?.startsWith('ak_')) {
            return setError('Invalid destination!');
        }
        if (!normalizedAmount || normalizedAmount <= 0) {
            return setError('Invalid amount!');
        }
        if (normalizedAmount > Number(ethereum.bridgeInfo?.asset?.balance || 0)) {
            return setError('Not enough balance!');
        }

        setButtonBusy(true);

        let action_type = BRIDGE_TOKEN_ACTION_TYPE;
        let eth_amount = BigInt(0);
        if (asset.ethAddress === Constants.ethereum.default_eth) {
            action_type = BRIDGE_ETH_ACTION_TYPE;
            eth_amount = BigInt(normalizedAmount);
        } else if (asset.ethAddress === Constants.ethereum.wae) {
            action_type = BRIDGE_AETERNITY_ACTION_TYPE;
        } else {
            try {
                const allowance = await assetContract.allowance(ethereumAddress, Constants.ethereum.bridge_address);
                if (allowance.lt(normalizedAmount)) {
                    const approveResult = await assetContract.approve(
                        Constants.ethereum.bridge_address,
                        normalizedAmount,
                    );
                    setOperationHash(approveResult.hash);
                    setConfirmingMsg('Approving allowance');
                    setConfirming(true);

                    await approveResult.wait(1);
                    setConfirming(false);
                }
            } catch (e: any) {
                Logger.error(e);
                setError(e.message);
            } finally {
                setConfirming(false);
                setConfirmingMsg('');
            }
        }

        try {
            const bridgeOutResult = await bridge.bridge_out(
                asset.ethAddress,
                destination,
                normalizedAmount.toString(),
                action_type,
                {
                    value: eth_amount,
                },
            );
            setOperationHash(bridgeOutResult.hash);
            setConfirmingMsg('Bridge action');
            setConfirming(true);

            await bridgeOutResult.wait(1);
        } catch (e: any) {
            Logger.error(e);
            setError(e.message);
        } finally {
            setConfirming(false);
            setConfirmingMsg('');
            setOperationHash('');
        }
        setButtonBusy(false);
    }, [asset, ethereum, destination, normalizedAmount, isValidDestination]);

    const bridgeToEvm = React.useCallback(async () => {
        if (!isValidDestination || !destination?.startsWith('0x')) {
            return setError('Invalid destination!');
        }
        if (!normalizedAmount || normalizedAmount <= 0) {
            return setError('Invalid amount!');
        }
        if (normalizedAmount > Number(aeternity.bridgeInfo?.asset?.balance || 0)) {
            return setError('Not enough balance!');
        }

        setButtonBusy(true);
        try {
            let action_type = BRIDGE_TOKEN_ACTION_TYPE;
            let ae_amount = BigInt(0);

            if (asset.aeAddress === Constants.aeternity.default_ae) {
                action_type = BRIDGE_AETERNITY_ACTION_TYPE;
                ae_amount = BigInt(normalizedAmount);
            } else {
                action_type =
                    asset.aeAddress === Constants.aeternity.aeeth ? BRIDGE_ETH_ACTION_TYPE : BRIDGE_TOKEN_ACTION_TYPE;
                const asset_contract = await Aeternity.Sdk.initializeContract({
                    aci: Constants.aeternity.asset_aci,
                    address: aeternity.bridgeInfo?.asset?.address as `ct_${string}`,
                    omitUnknown: true,
                });

                const { decodedResult: allowance } = await asset_contract.allowance({
                    from_account: aeternityAddress,
                    for_account: Constants.aeternity.bridge_address.replace('ct_', 'ak_'),
                });

                if (allowance === undefined) {
                    setConfirmingMsg('Creating allowance');
                    setConfirming(true);
                    await asset_contract.create_allowance(
                        Constants.aeternity.bridge_address.replace('ct_', 'ak_'),
                        normalizedAmount,
                    );
                } else if (Number(allowance) < Number(normalizedAmount)) {
                    setConfirmingMsg('Updating allowance');
                    setConfirming(true);
                    await asset_contract.change_allowance(
                        Constants.aeternity.bridge_address.replace('ct_', 'ak_'),
                        normalizedAmount,
                    );
                }
                setConfirming(false);
                setConfirmingMsg('');
            }
            const bridge_contract = await Aeternity.Sdk.initializeContract({
                aci: Constants.aeternity.bridge_aci,
                address: Constants.aeternity.bridge_address,
                omitUnknown: true,
            });

            setConfirmingMsg('Bridge action');
            setConfirming(true);
            const bridge_out_call = await bridge_contract.bridge_out(
                [asset.ethAddress, destination, normalizedAmount, action_type],
                { amount: ae_amount },
            );
            setOperationHash(bridge_out_call.hash);
        } catch (e: any) {
            Logger.error(e);
            setError(e.message);
        } finally {
            setConfirming(false);
            setConfirmingMsg('');
            setTimeout(() => setOperationHash(''), 5000);
        }

        setButtonBusy(false);
    }, [asset, aeternity, destination, normalizedAmount, isValidDestination]);
    return (
        <Container sx={{ paddingY: 8 }}>
            <Grid container direction="row" justifyContent="center" alignItems="flex-start" sx={{ marginBottom: 10 }}>
                <Card sx={{ minWidth: 375 }}>
                    <CardContent>
                        <Stack justifyContent="space-between" direction={'row'}>
                            <Typography variant="h4" gutterBottom>
                                Bridge {!Constants.isMainnet && 'Testnet'}
                            </Typography>
                            <Breadcrumbs separator={<NavigateNextIcon />} aria-label="breadcrumb">
                                {direction == Direction.AeternityToEthereum ? (
                                    <AeternityIcon width={48} height={48} />
                                ) : (
                                    <EthereumIcon width={48} height={48} />
                                )}
                                {direction == Direction.AeternityToEthereum ? (
                                    <EthereumIcon width={48} height={48} />
                                ) : (
                                    <AeternityIcon width={48} height={48} />
                                )}
                            </Breadcrumbs>
                        </Stack>

                        <Divider flexItem orientation="horizontal" sx={{ marginTop: 1, marginBottom: 3 }} />

                        <Grid container direction="row" spacing={1} sx={{ marginBottom: 2 }}>
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <InputLabel id="network-from-select-label">From Network</InputLabel>
                                    <Select
                                        labelId="network-from-select-label"
                                        id="network-from-select"
                                        label="From Network"
                                        value={direction}
                                        onChange={handleDirectionChange}
                                    >
                                        <MenuItem value={Direction.AeternityToEthereum}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AeternityIcon />{' '}
                                                <Box sx={{ marginLeft: 1 }}>
                                                    æternity {!Constants.isMainnet && 'Testnet'}
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value={Direction.EthereumToAeternity}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <EthereumIcon />{' '}
                                                <Box sx={{ marginLeft: 1 }}>
                                                    Ethereum {!Constants.isMainnet && 'Sepholia Testnet'}
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={7}>
                                <FormControl fullWidth>
                                    <InputLabel id="token-select-label">Token</InputLabel>
                                    <Select
                                        labelId="token-select-label"
                                        id="token-select"
                                        label="Token"
                                        value={asset.symbol}
                                        onChange={handleAssetChange}
                                    >
                                        {assets.map((_asset) => (
                                            <MenuItem value={_asset.symbol} key={_asset.symbol}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <img
                                                        src={_asset.icon}
                                                        width={24}
                                                        height={24}
                                                        style={{ marginRight: 10 }}
                                                    />
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {printBalance(
                                                            direction,
                                                            _asset,
                                                            _asset.symbol == asset.symbol,
                                                            ethereum.bridgeInfo,
                                                            aeternity.bridgeInfo,
                                                        )}
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <TextField
                                id="token-select"
                                label="Destination Token"
                                value={
                                    (direction == Direction.EthereumToAeternity ? 'æ' : '') +
                                    asset.symbol +
                                    ` (${
                                        direction == Direction.EthereumToAeternity ? asset.aeAddress : asset.ethAddress
                                    })`
                                }
                                disabled
                            ></TextField>
                        </FormControl>

                        <TextField
                            fullWidth
                            id="outlined-textfield-amount"
                            label={`Total Amount (${asset.decimals} decimals)`}
                            placeholder={`0.00001 ${asset.symbol}`}
                            variant="outlined"
                            type="number"
                            autoComplete="off"
                            inputProps={{ step: 0.000001 }}
                            sx={{ marginBottom: 2 }}
                            onChange={handleAmount}
                            value={amount || ''}
                        />

                        <TextField
                            error={!isValidDestination}
                            fullWidth
                            id="outlined-textfield-destination"
                            label={`Destination ${
                                direction == Direction.EthereumToAeternity ? 'Aeternity' : 'Ethereum'
                            } Address`}
                            variant="outlined"
                            type="text"
                            autoComplete="off"
                            value={destination || ''}
                            onChange={handleDestination}
                        />
                    </CardContent>

                    <Grid container direction="row" justifyContent="center" alignItems="center">
                        <Grid item>
                            <Spinner
                                loading={confirming}
                                msg={`Confirming (${confirmingMsg}) ...`}
                                size={32}
                                margin={3}
                            />
                        </Grid>
                    </Grid>
                    <CardActions sx={{ margin: 1, paddingTop: 1 }}>
                        <WalletConnection
                            onWalletConnectError={setError}
                            requiredWallet={
                                direction == Direction.EthereumToAeternity
                                    ? RequiredWallet.Ethereum
                                    : RequiredWallet.Aeternity
                            }
                        >
                            <Button
                                disabled={buttonBusy}
                                sx={{ ':hover': { background: '#222' } }}
                                fullWidth
                                variant="contained"
                                onClick={direction === Direction.AeternityToEthereum ? bridgeToEvm : bridgeToAeternity}
                            >
                                Bridge to {direction === Direction.AeternityToEthereum ? 'Ethereum' : 'Aeternity'}
                            </Button>
                        </WalletConnection>
                    </CardActions>
                </Card>
            </Grid>

            {!!error && (
                <Dialog title="Error" open={true} onClose={() => setError('')} maxWidth="md">
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        {error.includes('ACTION_REJECTED') ? 'User rejected transaction' : error}
                    </DialogContent>
                </Dialog>
            )}
            <Dialog title="Operation Hash" open={!!operationHash} onClose={() => setOperationHash('')} maxWidth="md">
                <DialogTitle>Transaction submitted</DialogTitle>
                <DialogContent>
                    {direction === Direction.AeternityToEthereum ? (
                        <a
                            style={{ color: 'black' }}
                            target="_blank"
                            href={`${Constants.aeternity.explorer}/transactions/${operationHash}`}
                            rel="noreferrer"
                        >
                            Check operation on AeScan
                        </a>
                    ) : (
                        <a
                            style={{ color: 'black' }}
                            target="_blank"
                            href={`${Constants.ethereum.etherscan}/tx/${operationHash}`}
                            rel="noreferrer"
                        >
                            Check operation on Etherscan
                        </a>
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
};
export default Bridge;
