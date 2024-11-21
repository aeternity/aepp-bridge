// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

using SafeERC20 for IERC20;

struct BridgeAction {
    IERC20 asset;
    address sender;
    string destination;
    uint256 amount;
    uint256 nonce;
}

struct InBridgeAction {
    address[] processors;
    mapping(bytes32 => uint16) submissions;
    uint8 status; // 0 - InProgress, 1 - Processed, 2 - Failed
}

library Status {
    uint8 constant InProgress = 0;
    uint8 constant Processed = 1;
    uint8 constant Failed = 2;
}

/**
* @notice Helper method for checking if a given list contains a given address.
*/
function isInList(address addr, address[] memory list) pure returns (bool) {
    for (uint i=0; i < list.length; i++) {
        if (list[i] == addr) {
            return true;
        }
    }
    return false;
}

contract BridgeV1 is Initializable {
    mapping(uint256 => BridgeAction) public bridge_actions;
    mapping(uint256 => InBridgeAction) public in_actions;
    uint256 public out_counter;
    address public owner;
    address public pending_owner;
    uint16 public processors_threshold;
    address[] public processors;

    function initialize() public initializer {
        processors_threshold = 1;
        out_counter = 1;
        owner = msg.sender;
    }

    event BridgeOut(IERC20 asset, address sender, string destination, uint amount, uint out_nonce);
    event BridgeIn(IERC20 asset, address destination, uint amount, uint in_nonce);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyProcessors() {
        require(isInList(msg.sender, processors), "NOT_PROCESSOR");
        _;
    }

    function set_processors_threshold(uint16 threshold) public onlyOwner {
        processors_threshold = threshold;
    }

    function add_processor(address processor) public onlyOwner {
        require(!isInList(processor, processors), "ALREADY_A_PROCESSOR");
        processors.push(processor);
    }

    function remove_processor(address processor) public onlyOwner {
        address[] memory new_list;
        for (uint i=0; i < processors.length; i++) {
            if (processors[i] != processor) {
                new_list[new_list.length] = processors[i];
            }
        }
        processors = new_list;
    }

    function change_owner(address new_owner) public onlyOwner {
        pending_owner = new_owner;
    }

    function confirm_new_owner() public {
        require(address(0) != pending_owner, "NULL_OWNER_NOT_ALLOWED");
        require(msg.sender == pending_owner, "NOT_PENDING_OWNER");
        owner = pending_owner;
        pending_owner = address(0);
    }

    function bridge_out(IERC20 asset, string memory destination, uint256 amount) public {
        // The amount must not be zero
        require(amount != 0, "ZERO_AMOUNT");

        // Transfer allowance to the contract
        asset.safeTransferFrom(msg.sender, address(this), amount);

        // TODO: Maybe validate destination

        emit BridgeOut(asset, msg.sender, destination, amount, out_counter);

        // Add outgoing action (Ethereum to Aeternity)
        bridge_actions[out_counter] = BridgeAction(asset, msg.sender, destination, amount, out_counter);

        // Increment action counter
        out_counter += 1;
    }

    function bridge_in(uint256 nonce, IERC20 asset, address destination, uint256 amount) public onlyProcessors {
        // Each processor can only fulfill once
        require(!isInList(msg.sender, in_actions[nonce].processors), "ALREADY_FULFILLED");
        // Add processor to the list of fulfillments
        in_actions[nonce].processors.push(msg.sender);

        // Hash action data and store submission
        bytes32 action_hash = keccak256(abi.encode(nonce, asset, destination, amount));
        in_actions[nonce].submissions[action_hash] += 1;

        // Transfer tokens and set action as processed
        // The action must be in progress
        bool in_progress = in_actions[nonce].status == Status.InProgress;
        if (in_progress && in_actions[nonce].submissions[action_hash] >= processors_threshold) {
            asset.safeTransfer(destination, amount);
            emit BridgeIn(asset, destination, amount, nonce);
            in_actions[nonce].status = Status.Processed;
        }
    }

    function movement_asset(uint256 id) public view returns(IERC20) {
        return bridge_actions[id].asset;
    }

    function movement_sender(uint256 id) public view returns(address) {
        return bridge_actions[id].sender;
    }

    function movement_destination(uint256 id) public view returns(string memory) {
        return bridge_actions[id].destination;
    }

    function movement_amount(uint256 id) public view returns(uint256) {
        return bridge_actions[id].amount;
    }

    function movement_nonce(uint256 id) public view returns(uint256) {
        return bridge_actions[id].nonce;
    }

    function in_action_status(uint256 id) public view returns(uint8) {
        return in_actions[id].status;
    }

    function in_action_submitted(uint256 id) public view returns(bool) {
        return isInList(msg.sender, in_actions[id].processors);
    }

    function getAddress() public view returns(address) {
        return address(this);
    }
}
