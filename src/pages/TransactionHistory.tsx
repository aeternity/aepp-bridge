import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    TextField,
    InputAdornment,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AeternityIcon from 'src/components/base/icons/aeternity';
import EthereumIcon from 'src/components/base/icons/ethereum';
import { Direction } from 'src/context/AppContext';
import useAppContext from 'src/hooks/useAppContext';
import useWalletContext from 'src/hooks/useWalletContext';

const TransactionHistory = () => {
    const { direction, updateDirection } = useAppContext();
    const { aeternityAddress, ethereumAddress } = useWalletContext();
    const connectedWalletAddress = direction === Direction.AeternityToEthereum ? aeternityAddress : ethereumAddress;

    return (
        <Container sx={{ paddingY: 8 }}>
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                <Card>
                    <CardContent>
                        <Typography variant="h3" gutterBottom pb={1}>
                            Transaction History
                        </Typography>
                        <Divider flexItem orientation="horizontal" sx={{ marginTop: 1, marginBottom: 3 }} />
                        <Box>
                            <FormControl>
                                <InputLabel id="network-from-select-label">Network</InputLabel>
                                <Select
                                    sx={{ marginRight: 1, marginBottom: 3 }}
                                    labelId="network-from-select-label"
                                    id="network-from-select"
                                    label="Network"
                                    value={direction}
                                    onChange={(e) => updateDirection(e.target.value as Direction)}
                                >
                                    <MenuItem value={Direction.AeternityToEthereum}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AeternityIcon /> <Box sx={{ marginLeft: 1 }}>æternity </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={Direction.EthereumToAeternity}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EthereumIcon /> <Box sx={{ marginLeft: 1 }}>Ethereum</Box>
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                sx={{ minWidth: { xs: 250, sm: 350, md: 600 }, marginBottom: 3 }}
                                label="Connected account"
                                value={connectedWalletAddress || 'Not connected'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <ContentCopyIcon
                                                sx={{ ':hover': { cursor: 'pointer' } }}
                                                onClick={() =>
                                                    connectedWalletAddress &&
                                                    navigator.clipboard.writeText(connectedWalletAddress)
                                                }
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                type="text"
                                disabled
                            />
                            <Divider flexItem orientation="horizontal" />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Container>
    );
};

export default TransactionHistory;
