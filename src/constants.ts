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

export const ETHEREUM_FUNDS_ADDRESS = '0xb322a9eae7d95aa8e8ae731c8daf4c8ff419c784';
export const AETERNITY_FUNDS_ADDRESS = 'ak_Kpsu4qiVRHuw6EKFKk9g5TqYF8XFUsmE9ynDyFpdRz8W5J6HW';
export const ETHEREUM_FUNDS_THRESHOLD = 0.01;
export const AETERNITY_FUNDS_THRESHOLD = 0.005;

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
