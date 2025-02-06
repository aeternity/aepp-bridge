import { ethers, Contract } from 'ethers';
import Constants from 'src/constants';
import { bridgeConfig } from 'src/chainConfig';
import Logger from './logger';

export let Provider: ethers.BrowserProvider;
try {
    Provider = new ethers.BrowserProvider((window as any).ethereum);
    // (window as any).ethereum.request({ method: 'eth_chainId' }).then(console.log);
    (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Constants.isMainnet ? bridgeConfig.mainnet.chainId : bridgeConfig.testnet.chainId }],
    });
} catch {
    Logger.error('No web3 wallet found.');
}

export const connect = async (): Promise<string> => {
    // Connect to web3 wallet
    await Provider.send('eth_requestAccounts', []);
    const signer = await Provider.getSigner();

    return signer.getAddress();
};

export const isAddressValid = (address: string) => ethers.isAddress(address);

export { Contract };
