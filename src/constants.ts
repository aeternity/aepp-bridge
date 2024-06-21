import deployment from './deployment.json';
import { bridgeConfig, assets } from './chainConfig';

export interface Asset {
    // token_rank?: number;
    // link: string;
    aeAddress: string;
    ethAddress: string;
    nameandsymbol: string;
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
}

const isMainnet = true;

const Constants = {
    isMainnet,
    assets: assets[isMainnet ? 'mainnet' : 'testnet'],
    ethereum: {
        bridge_address: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].eth_bridge_address,
        etherscan: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].etherscan,
        ethChainId: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].chainId,
        bridge_abi: deployment.ethereum.bridge_abi,
        asset_abi: deployment.ethereum.asset_abi,
        wae: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].wae,
        default_eth: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].default_eth,
    },
    aeternity: {
        bridge_address: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].ae_bridge_address as `ct_${string}`,
        explorer: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].aescan,
        rpc: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].aeRpc,
        bridge_aci: deployment.aeternity.bridge_aci,
        asset_aci: deployment.aeternity.asset_aci,
        aeeth: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].aeeth,
        default_ae: bridgeConfig[isMainnet ? 'mainnet' : 'testnet'].default_ae,
    },
};

export default Constants;
