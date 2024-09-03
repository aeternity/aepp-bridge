import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';

const ITEMS = [
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

const LeftMenu = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'white',
                boxShadow: '0 0 3px rgba(0, 0, 0, 0.1)',
                borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
                display: 'flex',
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
                {ITEMS.map((item, index) => (
                    <ListItemButton
                        key={index}
                        sx={{
                            marginTop: { md: 2 },
                            marginRight: 0.5,
                            borderLeft: { md: 5 },
                            borderLeftColor: { md: '#f5274e' },
                        }}
                        selected={window.location.pathname === item.link}
                        href={item.link}
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
        </Box>
    );
};

export default LeftMenu;
