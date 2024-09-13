import {
    Card,
    CardContent,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Constants from '../constants';
import addTokenToEthereumWallet from 'src/utils/addTokenToEthereumWallet';

const SupportedTokensList = () => {
    return (
        <Container sx={{ paddingY: 8 }}>
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom p={1}>
                            Supported Tokens
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ width: '100%' }} aria-label="tokens">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Name & Symbol</TableCell>
                                        <TableCell>Decimals</TableCell>
                                        <TableCell>Ethereum Address</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Constants.assets.map((asset, index) => (
                                        <TableRow
                                            key={asset.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img width={16} height={16} src={asset.icon} />
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {asset.symbol === 'ETH' ? 'Ethereum (ETH)' : asset.nameandsymbol}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {asset.decimals}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {asset.symbol === 'ETH' ? 'Native ETH' : asset.ethAddress}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {asset.symbol !== 'ETH' && (
                                                    <a
                                                        href="javascript:void(0)"
                                                        onClick={() => addTokenToEthereumWallet(asset)}
                                                    >
                                                        Add to Wallet
                                                    </a>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Container>
    );
};

export default SupportedTokensList;
