import Constants from 'src/constants';
import { Direction } from 'src/context/AppContext';

const getTxUrl = (direction: Direction, hash: string) => {
    return direction === Direction.AeternityToEthereum
        ? `${Constants.aeternity.explorer}/transactions/${hash}`
        : `${Constants.ethereum.etherscan}/tx/${hash}`;
};

export default getTxUrl;
