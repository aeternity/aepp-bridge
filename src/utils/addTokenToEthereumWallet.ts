import { Asset } from 'src/constants';

const addTokenToEthereumWallet = async (asset: Asset) => {
    const tokenAddress = asset.ethAddress;
    const tokenSymbol = asset.symbol;
    const tokenDecimals = asset.decimals;
    const tokenImage = asset.icon;

    try {
        const wasAdded = await (window as any).ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: tokenAddress,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals,
                    image: tokenImage,
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
};
export default addTokenToEthereumWallet;
