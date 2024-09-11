import { useNavigate } from 'react-router-dom';

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import SuperHeroIcon from 'src/components/base/icons/superhero';
import MetaMaskIcon from 'src/components/base/icons/metamask';
import { EVM_WALLET_INSTALL_URL, SUPERHERO_WALLET_URL } from 'src/constants';

const MAIN_ITEMS = [
    {
        icon: RouteOutlinedIcon,
        text: 'Bridge',
        link: '/',
    },
    {
        icon: ReceiptOutlinedIcon,
        text: 'Transactions',
        link: '/transactions',
    },
];

const SUB_ITEMS = [
    {
        icon: SuperHeroIcon,
        text: 'æternity Wallet',
        link: SUPERHERO_WALLET_URL,
        external: true,
    },
    {
        icon: MetaMaskIcon,
        text: 'EVM Wallet',
        link: EVM_WALLET_INSTALL_URL,
        external: true,
    },
    {
        icon: QuizIcon,
        text: 'How To / FAQ',
        link: '/faq',
    },
];

const LeftMenu = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                backgroundColor: 'white',
                boxShadow: '0 9px 14px rgba(0, 0, 0, 2.1)',
                borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                justifyContent: { xs: 'center', sm: 'center', md: 'space-between' },
                display: 'flex',
                flexDirection: { xs: 'row', sm: 'row', md: 'column' },
            }}
        >
            <List
                sx={{
                    margin: 0,
                    padding: 0,
                    flexDirection: { xs: 'row', sm: 'row', md: 'column' },
                    display: { xs: 'flex', sm: 'flex', md: 'block' },
                }}
            >
                {MAIN_ITEMS.map((item, index) => (
                    <ListItemButton
                        key={index}
                        sx={{
                            marginTop: { md: 2 },
                            marginRight: 0.5,
                            marginLeft: 0.5,
                            borderLeft: { md: 5 },
                            ...(window.location.pathname === item.link && { borderLeftColor: { md: '#f5274e' } }),
                        }}
                        selected={window.location.pathname === item.link}
                        onClick={() => navigate(item.link)}
                    >
                        <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 'auto', md: 40 } }} aria-label={item.text}>
                            <item.icon
                                sx={{
                                    maxWidth: 28,
                                    maxHeight: 28,
                                    width: { xs: 20, sm: 28 },
                                    height: { xs: 20, sm: 28 },
                                    color: 'black',
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{ variant: 'button' }}
                            sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
                        />
                    </ListItemButton>
                ))}
            </List>
            <List sx={{ display: { xs: 'flex', sm: 'flex', md: 'block' } }}>
                {SUB_ITEMS.map((item, index) => {
                    return (
                        <ListItem
                            key={index}
                            sx={{ cursor: 'pointer', ':hover': { textDecoration: 'underline', color: 'black' } }}
                            onClick={() =>
                                item.external ? (window as any).open(item.link, '_blank').focus() : navigate(item.link)
                            }
                        >
                            <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 'auto', md: 40 } }}>
                                <item.icon width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                                {item.text}
                            </ListItemText>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default LeftMenu;
