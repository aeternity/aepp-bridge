import {
    BrowserWindowMessageConnection,
    Node,
    SUBSCRIPTION_TYPES,
    walletDetector,
    isAddressValid,
    AeSdk,
    Contract,
    AccountMetamaskFactory,
    WalletConnectorFrame,
    AccountBase,
} from '@aeternity/aepp-sdk';
type Wallet = Parameters<Parameters<typeof walletDetector>[1]>[0]['newWallet'];

import Constants from 'src/constants';

let connector: WalletConnectorFrame;

export const Sdk = new AeSdk({
    nodes: [{ name: Constants.isMainnet ? 'mainnet' : 'testnet', instance: new Node(Constants.aeternity.rpc) }],
});

export const connect = async (
    wallet: 'metamask' | 'superhero',
    onAccountChange?: (accounts: AccountBase[]) => void,
): Promise<string> => {
    if (wallet === 'metamask') {
        const factory = new AccountMetamaskFactory();
        await factory.installSnap();

        Sdk.addAccount(await factory.initialize(0), { select: true });
        console.log('Metamask account', Sdk.address);
        return Sdk.address;
    } else {
        const wallet = await new Promise<Wallet>((resolveWallet) => {
            const scannerConnection = new BrowserWindowMessageConnection();
            const stopScan = walletDetector(scannerConnection, ({ newWallet }) => {
                resolveWallet(newWallet);
                stopScan();
            });
        });
        connector = await WalletConnectorFrame.connect('Bridge Aepp', wallet.getConnection());

        return new Promise(async (resolveConnect) => {
            connector.addListener('accountsChange', async (accounts: AccountBase[]) => {
                Sdk.addAccount(accounts[0], { select: true });
                onAccountChange && onAccountChange(accounts);
                resolveConnect(Sdk.address);
            });
            connector.addListener('networkIdChange', async (networkId: string) => {
                Sdk.selectNode(networkId);
            });
            connector.addListener('disconnect', () => alert('Aepp is disconnected'));
            await connector.subscribeAccounts(SUBSCRIPTION_TYPES.subscribe, 'current');
        });
    }
};

export const detectWallet = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const handleWallets = async ({ wallets, newWallet }: any) => {
            clearTimeout(walletDetectionTimeout);
            stopScan();
            resolve(!!newWallet);
        };

        const scannerConnection = new BrowserWindowMessageConnection();
        const walletDetectionTimeout = setTimeout(() => resolve(false), 5000);
        const stopScan = walletDetector(scannerConnection, handleWallets);
    });
};

export const initializeContract = async (options: {
    aci: any;
    address: `ct_${string}` | `${string}.chain` | undefined;
    omitUnknown: boolean;
}) => {
    return Contract.initialize({
        ...Sdk.getContext(),
        aci: options.aci,
        address: options.address,
        omitUnknown: options.omitUnknown,
    });
};

export { isAddressValid, Contract, connector };
