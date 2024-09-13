import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import addTokenToEthereumWallet from 'src/utils/addTokenToEthereumWallet';
import PageContainer from 'src/components/base/PageContainer';
import Constants from '../constants';

const SupportedTokensList = () => {
    return (
        <PageContainer title="Supported Tokens">
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
                            <TableRow key={asset.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                                        <a href="javascript:void(0)" onClick={() => addTokenToEthereumWallet(asset)}>
                                            Add to Wallet
                                        </a>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </PageContainer>
    );
};

export default SupportedTokensList;
