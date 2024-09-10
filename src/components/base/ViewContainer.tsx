import React from 'react';
import { makeStyles } from '@mui/styles';

import NavigationBar from '../navigation';
import Typography from '@mui/material/Typography';
import { Link, Box } from '@mui/material';

import packageJson from '../../../package.json';
import LeftMenu from '../navigation/LeftMenu';

const useStyles = makeStyles({
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'calc(10px + 2vmin)',
        flex: 1,
    },
    footer: {
        width: '100%',
        display: 'flex',
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    link: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
    },
});
const linkStyles = { marginLeft: 2, textDecoration: 'none', ':hover': { textDecoration: 'underline' }, color: 'black' };

const ViewContainer: React.FC<{ children: React.ReactNode }> = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <NavigationBar />
            <Box
                sx={{
                    display: 'flex',
                    margin: 0,
                    padding: 0,
                    flex: 1,
                    flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                }}
            >
                <LeftMenu />
                <div className={classes.container}>{props.children}</div>
            </Box>
            <footer className={classes.footer}>
                <Box sx={{ flexDirection: 'row', display: 'flex', flexGrow: 1, flex: 1, pl: 3, pr: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontSize: 12 }}>Powered by</Typography>
                        <Link sx={{ ...linkStyles, marginLeft: 0 }} href="https://acurast.com/" target="_blank">
                            Acurast
                        </Link>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            ml: 1,
                            pl: 1,
                            borderLeft: 1,
                            borderColor: 'grey.300',
                        }}
                    >
                        <Typography sx={{ fontSize: 12 }}>{`v${packageJson.version}`}</Typography>
                        {process.env.REACT_APP_REVISION && (
                            <Typography sx={{ fontSize: 12 }}>{`rev:${process.env.REACT_APP_REVISION}`}</Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                        <Link sx={linkStyles} href="https://github.com/aeternity/aepp-bridge" target="_blank">
                            GitHub Repo
                        </Link>
                        <Link sx={linkStyles} href="/terms">
                            Terms and Conditions
                        </Link>
                        <Box sx={{ display: { md: 'flex', sm: 'none', xs: 'none' } }}>
                            <Link sx={linkStyles} href="https://aescan.io" target="_blank">
                                Blockchain Explorer
                            </Link>
                            <Link sx={linkStyles} href="https://forum.aeternity.com" target="_blank">
                                Community Support
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </footer>
        </div>
    );
};

export default ViewContainer;
