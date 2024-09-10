import { Box, Toolbar, AppBar, Link, Divider } from '@mui/material';

import AeternityBridgeLogo from '../base/icons/aerc-logo';
import ConnectWallet from './ConnectWallet';

const linkStyles = { marginLeft: 2, textDecoration: 'none', ':hover': { textDecoration: 'underline' }, color: 'black' };

const NavigationBar = () => {
    return (
        <AppBar position="static" color="default" sx={{ boxShadow: 'none', background: '#ffffff' }}>
            <Toolbar>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'space-between',
                    }}
                >
                    <Link href="/">
                        <AeternityBridgeLogo height="50" />
                    </Link>
                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                        <Box sx={{ alignItems: 'center', display: { sm: 'flex', xs: 'none' } }}>
                            <Link sx={linkStyles} href="https://aeternity.com" target="_blank">
                                æternity Website
                            </Link>
                        </Box>

                        <Divider flexItem orientation="vertical" sx={{ margin: 1, ml: 2 }} />
                        <ConnectWallet />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
