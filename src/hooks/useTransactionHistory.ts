import { useEffect, useState } from 'react';
import { Direction } from 'src/context/AppContext';
import Constants from 'src/constants';
import * as Ethereum from 'src/services/ethereum';
import BigNumber from 'bignumber.js';

interface BridgeAction {
    direction: Direction;
    hash: string;
    toAddress: string;
    tokenSymbol: string;
    tokenIcon: string;
    amount: number;
}

const useTransactionHistory = (direction: Direction, address?: string) => {
    const [transactions, setTransactions] = useState<BridgeAction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async function () {
            setLoading(true);

            if (direction === Direction.AeternityToEthereum) {
                setTransactions(await fetchAeternityTransactions(address));
            } else if (direction === Direction.EthereumToAeternity) {
                setTransactions(await fetchEthereumTransactions(address));
            }

            setLoading(false);
        })();
    }, [direction, address]);

    return { transactions, loading };
};

const fetchEthereumTransactions = async (address?: string) => {
    if (!address) {
        return [];
    }

    const bridgeContract = new Ethereum.Contract(
        Constants.ethereum.bridge_address,
        Constants.ethereum.bridge_abi,
        Ethereum.Provider,
    );
    const filter = bridgeContract.filters.BridgeOut();
    const events = await bridgeContract.queryFilter(filter, 20141309, 'latest');

    return parseEthereumTransactions(events);
};

const parseEthereumTransactions = (events: any): BridgeAction[] => {
    return events.map((event: any) => {
        const token = Constants.assets.find((asset) => asset.ethAddress.toLowerCase() === event.args[0].toLowerCase())!;
        const toAddress = event.args[2];
        const amount = new BigNumber(event.args[3].toString()).toNumber();

        return {
            amount,
            toAddress,
            tokenIcon: token.icon,
            tokenSymbol: token.symbol,
            hash: event.transactionHash,
            timestamp: event.blockNumber,
        };
    });
};

const fetchAeternityTransactions = async (address?: string) => {
    if (!address) {
        return [];
    }

    const transactionsStartUrl = `${Constants.aeAPI}/v3/transactions?account=${address}&contract_id=${Constants.aeternity.bridge_address}&entrypoint=bridge_out&limit=100`;
    const fetchTransactions = async (url: string, prevData: any[] = []): Promise<any[]> => {
        const _response = await fetch(url);
        const response = await _response.json();

        const aggregatedData = [...prevData, ...response.data];
        if (response.next) {
            return fetchTransactions(`${Constants.aeAPI}${response.next}`, aggregatedData);
        } else {
            return aggregatedData;
        }
    };

    const transactions = await fetchTransactions(transactionsStartUrl);

    return parseAeternityTransactions(transactions);
};

const parseAeternityTransactions = (transactions: any): BridgeAction[] => {
    return transactions.map((transaction: any) => {
        const token = Constants.assets.find(
            (asset) => asset.ethAddress.toLowerCase() === transaction.tx.arguments[0].value[0].value.toLowerCase(),
        )!;
        const toAddress = transaction.tx.arguments[0].value[1].value;
        const amount = transaction.tx.arguments[0].value[2].value;

        return {
            amount,
            toAddress,
            tokenIcon: token.icon,
            tokenSymbol: token.symbol,
            hash: transaction.hash,
            timestamp: transaction.micro_time,
        };
    });
};

export default useTransactionHistory;
