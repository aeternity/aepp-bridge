import { Box, Button, Modal, Typography } from '@mui/material';

import * as Aeternity from 'src/services/aeternity';
import useWalletContext from 'src/hooks/useWalletContext';
import SuperHeroIcon from 'src/components/base/icons/superhero';
import MetaMaskIcon from 'src/components/base/icons/metamask';
import { SUPERHERO_WALLET_URL } from 'src/constants';
import Logger from 'src/services/logger';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AEWalletSelect = () => {
    const {
        showAeWalletSelect,
        setShowAeWalletSelect,
        aeternityWalletDetected,
        ethereumWalletDetected,
        setConnecting,
        setAeternityAddress,
        handleWalletConnectError,
    } = useWalletContext();

    const handleConnectButtonClick = async (wallet: 'metamask' | 'superhero') => {
        try {
            setConnecting(true);
            const address = await Aeternity.connect(wallet, (accounts) => {
                if (accounts.length > 0) {
                    setAeternityAddress(accounts[0].address);
                }
            });
            setAeternityAddress(address);
        } catch (e) {
            Logger.error(e);
            handleWalletConnectError((e as Error).message);
        } finally {
            setConnecting(false);
            setShowAeWalletSelect(false);
        }
    };

    return (
        <Modal open={showAeWalletSelect} onClose={() => setShowAeWalletSelect(false)}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Select a wallet
                </Typography>
                <Typography sx={{ my: 2 }}>Please select a wallet to connect to the application:</Typography>
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                    {aeternityWalletDetected && (
                        <Button variant="text" fullWidth={true} onClick={() => handleConnectButtonClick('superhero')}>
                            <SuperHeroIcon width={32} height={32} style={{ marginRight: 5 }} />
                            Superhero Wallet
                        </Button>
                    )}
                    {ethereumWalletDetected && (
                        <Button variant="text" fullWidth={true} onClick={() => handleConnectButtonClick('metamask')}>
                            <MetaMaskIcon width={32} height={32} style={{ marginRight: 5 }} />
                            Metamask Wallet
                        </Button>
                    )}
                    {!aeternityWalletDetected && (
                        <Button
                            variant="text"
                            fullWidth={true}
                            onClick={() => (window as any).open(SUPERHERO_WALLET_URL, '_blank').focus()}
                        >
                            <SuperHeroIcon width={32} height={32} style={{ marginRight: 5 }} />
                            Install Superhero Wallet
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default AEWalletSelect;
