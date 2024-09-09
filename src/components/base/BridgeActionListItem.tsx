import moment from 'moment';
import { Box, Link, Typography } from '@mui/material';
import { BridgeAction } from 'src/hooks/useTransactionHistory';
import { Direction } from 'src/context/AppContext';
import AeternityIcon from './icons/aeternity';
import EthereumIcon from './icons/ethereum';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import getTxUrl from 'src/utils/getTxUrl';

interface Props {
    item: BridgeAction;
}

const BridgeActionListItem = ({ item }: Props) => {
    const date = moment(item.timestamp);
    const fromNow = date.fromNow();

    return (
        <Box
            flex={1}
            flexDirection={'row'}
            display={'flex'}
            gap={2}
            justifyContent={'space-around'}
            flexWrap={'wrap'}
            mt={1}
            mb={1}
            pt={1}
            pb={1}
            sx={{ '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }}
        >
            <Typography sx={{ color: 'black' }} component={'span'} variant="body1" width={120}>
                <Link target="_blank" href={getTxUrl(item.direction, item.hash)}>
                    {fromNow}
                </Link>
            </Typography>

            <Box display="flex" alignItems={'center'} gap={1}>
                {item.direction === Direction.AeternityToEthereum ? (
                    <>
                        <AeternityIcon />
                        <Typography component="span" variant="body1">
                            æternity
                        </Typography>
                        <ArrowForwardIcon />
                        <EthereumIcon />
                        <Typography component="span" variant="body1">
                            Ethereum
                        </Typography>
                    </>
                ) : (
                    <>
                        <EthereumIcon />
                        <Typography component="span" variant="body1">
                            Ethereum
                        </Typography>
                        <ArrowForwardIcon />
                        <AeternityIcon />
                        <Typography component="span" variant="body1">
                            æternity
                        </Typography>
                    </>
                )}
            </Box>

            <Box display={'flex'} gap={1} alignItems={'center'} width={120}>
                <img width={28} height={28} src={item.tokenIcon} alt={item.tokenSymbol} />
                <Typography component="span" variant="body1">
                    {item.amount}
                </Typography>
                <Typography component="span" variant="body1">
                    {item.tokenSymbol}
                </Typography>
            </Box>
        </Box>
    );
};
export default BridgeActionListItem;
