import BigNumber from 'bignumber.js';
import { SnackbarProvider } from 'notistack';
import ReactDOMClient from 'react-dom/client';

import './index.css';
import reportWebVitals from './reportWebVitals';
import ThemeProvider from './context/ThemeProvider';
import Router from './Routes';
import AppProvider from './context/AppProvider';
import WalletProvider from './context/WalletProvider';
import AEWalletSelect from './components/navigation/AEWalletSelect';
import { AppKitProvider } from './context/AppKitProvider';

const container = document.getElementById('root');
if (!container) {
    alert('Root <div/> missing!');
    throw new Error('Root <div/> missing!');
}

// For some reason Web3 depends on the process api
global.process = require('process');
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App = () => (
    <AppKitProvider>
        <ThemeProvider>
            <SnackbarProvider classes={{ containerRoot: 'snackRoot' }}>
                <WalletProvider>
                    <AppProvider>
                        <AEWalletSelect />
                        <Router />
                    </AppProvider>
                </WalletProvider>
            </SnackbarProvider>
        </ThemeProvider>
    </AppKitProvider>
);

ReactDOMClient.createRoot(container).render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
