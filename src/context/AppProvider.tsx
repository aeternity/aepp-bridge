import React from 'react';
import AppContext, { AeternityAssetInfo, EthereumAssetInfo, Direction, BridgeInfo } from './AppContext';
import * as Aeternity from 'src/services/aeternity';
import Constants, {
    Asset,
    AETERNITY_FUNDS_ADDRESS,
    ETHEREUM_FUNDS_ADDRESS,
    ETHEREUM_FUNDS_THRESHOLD,
    AETERNITY_FUNDS_THRESHOLD,
} from 'src/constants';
import { assets } from 'src/chainConfig';
import Logger from 'src/services/logger';
import * as Ethereum from 'src/services/ethereum';
import useWalletContext from 'src/hooks/useWalletContext';
import BigNumber from 'bignumber.js';

async function fetchAeternityBridgeInfo(): Promise<BridgeInfo> {
    const bridgeContract = await Aeternity.Sdk.initializeContract({
        aci: Constants.aeternity.bridge_aci,
        address: Constants.aeternity.bridge_address,
        omitUnknown: true,
    });

    const [{ decodedResult: isEnabled }, _fundAccountBalance] = await Promise.all([
        bridgeContract.is_enabled(),
        Ethereum.Provider.getBalance(ETHEREUM_FUNDS_ADDRESS),
    ]);

    const fundAccountBalance = new BigNumber(_fundAccountBalance.toString()).shiftedBy(-18);
    const areFundsSufficient = fundAccountBalance.isGreaterThanOrEqualTo(ETHEREUM_FUNDS_THRESHOLD);

    return {
        isEnabled,
        areFundsSufficient,
    };
}

async function fetchAeternityAssetInfo(asset: Asset, aeternityAddress?: string): Promise<AeternityAssetInfo> {
    const bridge_contract = await Aeternity.Sdk.initializeContract({
        aci: Constants.aeternity.bridge_aci,
        address: Constants.aeternity.bridge_address,
        omitUnknown: true,
    });

    let { decodedResult: asset_address } = await bridge_contract.native_ae();
    let asset_balance = 0;

    if (asset.aeAddress === Constants.aeternity.default_ae) {
        if (aeternityAddress) {
            const balance = await Aeternity.Sdk.getBalance(aeternityAddress as `ak_${string}`);
            asset_balance = Number(balance);
        }
    } else {
        try {
            let { decodedResult: asset_addr } =
                asset.aeAddress === Constants.aeternity.aeeth
                    ? await bridge_contract.native_eth()
                    : await bridge_contract.asset(asset.ethAddress);

            asset_address = asset_addr;
            const asset_contract = await Aeternity.Sdk.initializeContract({
                aci: Constants.aeternity.asset_aci,
                address: asset_addr,
                omitUnknown: true,
            });
            if (aeternityAddress) {
                const { decodedResult } = await asset_contract.balance(aeternityAddress);
                asset_balance = decodedResult;
            }
        } catch (error) {}
    }

    return {
        asset: {
            address: asset_address,
            balance: asset_balance?.toString() || '0',
        },
    };
}

async function fetchEthereumBridgeInfo(): Promise<BridgeInfo> {
    const bridgeContract = new Ethereum.Contract(
        Constants.ethereum.bridge_address,
        Constants.ethereum.bridge_abi,
        Ethereum.Provider,
    );

    const [isEnabled, _fundAccountBalance] = await Promise.all([
        bridgeContract.isEnabled(),
        Aeternity.Sdk.getBalance(AETERNITY_FUNDS_ADDRESS as `ak_${string}`),
    ]);

    const fundAccountBalance = new BigNumber(_fundAccountBalance.toString()).shiftedBy(-18);
    const areFundsSufficient = fundAccountBalance.isGreaterThanOrEqualTo(AETERNITY_FUNDS_THRESHOLD);

    return {
        isEnabled,
        areFundsSufficient,
    };
}

async function fetchEthereumAssetInfo(assetAddress: string, ethereumAddress?: string): Promise<EthereumAssetInfo> {
    let balance = '';

    if (assetAddress === Constants.ethereum.default_eth) {
        if (ethereumAddress) {
            balance = (await Ethereum.Provider.getBalance(ethereumAddress)).toString();
        }
    } else {
        const asset = new Ethereum.Contract(
            assetAddress,
            [
                {
                    inputs: [
                        {
                            internalType: 'address',
                            name: 'account',
                            type: 'address',
                        },
                    ],
                    name: 'balanceOf',
                    outputs: [
                        {
                            internalType: 'uint256',
                            name: '',
                            type: 'uint256',
                        },
                    ],
                    stateMutability: 'view',
                    type: 'function',
                },
            ],
            Ethereum.Provider,
        );
        balance = (await asset.balanceOf(ethereumAddress).catch(() => 0)).toString();
    }

    return {
        asset: {
            address: assetAddress,
            balance: balance,
        },
    };
}

const fetchEthereumBalance = async (address: string | undefined) => {
    if (!address) return;
    const balance = new BigNumber((await Ethereum.Provider.getBalance(address)).toString());

    return balance.shiftedBy(-18).toFormat(2, BigNumber.ROUND_DOWN);
};

const fetchAeternityBalance = async (address: string | undefined) => {
    if (!address) return;
    address = address.replace('ak_', '');

    const balance = await Aeternity.Sdk.getBalance(`ak_${address}`);

    return new BigNumber(balance.toString()).shiftedBy(-18).toFormat(2, BigNumber.ROUND_DOWN);
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isMounter = React.useRef(false);
    const { aeternityAddress, ethereumAddress, tryConnectToAeternityWallet } = useWalletContext();
    const [asset, updateAsset] = React.useState<Asset>(Constants.assets[0]);
    const [ethereumAssetInfo, setEthereumAssetInfo] = React.useState<EthereumAssetInfo>();
    const [aeternityAssetInfo, setAeternityAssetInfo] = React.useState<AeternityAssetInfo>();
    const [direction, updateDirection] = React.useState<Direction>(Direction.EthereumToAeternity);
    const [ethereumBalance, setEthereumBalance] = React.useState<string>();
    const [aeternityBalance, setAeternityBalance] = React.useState<string>();

    const [isEthereumBridgeEnabled, setEthereumBridgeEnabled] = React.useState<boolean>(true);
    const [isAeternityBridgeEnabled, setAeternityBridgeEnabled] = React.useState<boolean>(true);
    const [areEthereumFundsSufficient, setEthereumFundsSufficient] = React.useState<boolean>(true);
    const [areAeternityFundsSufficient, setAeternityFundsSufficient] = React.useState<boolean>(true);

    React.useEffect(() => {
        isMounter.current = true;

        const fetch = () => {
            // Ethereum
            fetchEthereumAssetInfo(asset.ethAddress, ethereumAddress)
                .then((info) => {
                    if (isMounter.current) {
                        setEthereumAssetInfo(info);
                    }
                })
                .catch(Logger.error);
            // Aeternity
            fetchAeternityAssetInfo(asset, aeternityAddress)
                .then((info) => {
                    if (isMounter.current) {
                        setAeternityAssetInfo(info);
                    }
                })
                .catch(Logger.error);

            fetchEthereumBalance(ethereumAddress).then(setEthereumBalance).catch(Logger.error);
            fetchAeternityBalance(aeternityAddress).then(setAeternityBalance).catch(Logger.error);
            fetchEthereumBridgeInfo()
                .then((info) => {
                    setEthereumBridgeEnabled(info.isEnabled!);
                    setEthereumFundsSufficient(info.areFundsSufficient!);
                })
                .catch(Logger.error);
            fetchAeternityBridgeInfo()
                .then((info) => {
                    setAeternityBridgeEnabled(info.isEnabled!);
                    setAeternityFundsSufficient(info.areFundsSufficient!);
                })
                .catch(Logger.error);
        };
        fetch(); // First fetch

        const cron = setInterval(fetch, 10000 /* 10 seconds */);
        return () => {
            isMounter.current = false;
            clearInterval(cron);
        };
    }, [ethereumAddress, asset, aeternityAddress]);

    return (
        <AppContext.Provider
            value={{
                asset,
                isMainnet: Constants.isMainnet,
                assets: assets[Constants.isMainnet ? 'mainnet' : 'testnet'],
                updateAsset: (asset: Asset) => {
                    updateAsset(asset);
                    setAeternityAssetInfo({});
                    setEthereumAssetInfo({});
                },
                aeternity: {
                    assetInfo: aeternityAssetInfo,
                    balance: aeternityBalance,
                    isEnabled: isAeternityBridgeEnabled,
                    areFundsSufficient: areAeternityFundsSufficient,
                },
                ethereum: {
                    assetInfo: ethereumAssetInfo,
                    balance: ethereumBalance,
                    isEnabled: isEthereumBridgeEnabled,
                    areFundsSufficient: areEthereumFundsSufficient,
                },
                direction,
                updateDirection: (direction: Direction) => {
                    updateDirection(direction);
                    if (direction === Direction.AeternityToEthereum) {
                        tryConnectToAeternityWallet();
                    }
                },
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
