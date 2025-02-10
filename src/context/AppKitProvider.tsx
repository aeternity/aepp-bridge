import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { AppKitNetwork, mainnet } from '@reown/appkit/networks';

const projectId = '969e93fa16b810b9f5c0f2771bb6fc95';

const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]];
const metadata = {
    name: 'AE Bridge',
    description: 'aeternity/Ethereum Bridge',
    url: 'https://ae-bridge.com/',
    icons: [],
};

createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    themeVariables: {
        '--w3m-color-mix': '#f5274e',
        '--w3m-color-mix-strength': 10,
        '--w3m-font-family': 'ClashDisplay-Variable',
        '--w3m-border-radius-master': '.5px',
    },
    features: {
        analytics: false,
        email: false,
        socials: false,
        swaps: false,
        onramp: false,
    },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
