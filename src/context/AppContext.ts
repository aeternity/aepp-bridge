import { createContext } from 'react';
import type { BigNumber } from 'bignumber.js';
import Constants, { Asset } from 'src/constants';

export interface AssetInfo {
    address: string;
    balance: string;
}

export interface AeternityAssetInfo {
    asset?: AssetInfo;
}

export interface EthereumAssetInfo {
    asset?: AssetInfo;
}

export interface BridgeInfo {
    isEnabled?: boolean;
    areFundsSufficient?: boolean;
}

export interface FundEvent {
    funder: string;
    amount: BigNumber;
    nonce: BigNumber;
}

export enum Direction {
    AeternityToEthereum = 'aeternity-ethereum',
    EthereumToAeternity = 'ethereum-aeternity',
    Both = 'both',
}

export interface IAppContext {
    isMainnet: boolean;
    asset: Asset;
    assets: Asset[];
    updateAsset: (symbol: Asset) => void;
    aeternity: {
        isEnabled?: boolean;
        areFundsSufficient?: boolean;
        assetInfo?: AeternityAssetInfo;
        balance?: string;
    };
    ethereum: {
        isEnabled?: boolean;
        areFundsSufficient?: boolean;
        assetInfo?: EthereumAssetInfo;
        balance?: string;
    };
    direction: Direction;
    updateDirection: (direction: Direction) => void;
}

const contextStub = {
    isMainnet: Constants.isMainnet,
    asset: {} as any,
    assets: [],
    aeternity: {},
    ethereum: {},
    direction: Direction.EthereumToAeternity,
    updateAsset: () => {},
    updateDirection: () => {},
};

const AppContext = createContext<IAppContext>(contextStub);

export default AppContext;
