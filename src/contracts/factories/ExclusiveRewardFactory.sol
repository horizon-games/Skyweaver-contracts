pragma solidity 0.7.4;

import "./RewardFactory.sol";

/**
 * @notice This is a contract allowing contract owner to mint up to N assets per period of 6 hours.
 * Each token id may only be minted once.
 * @dev This contract should only be able to mint some asset types
 */
contract ExclusiveRewardFactory is RewardFactory {
    mapping(uint256 => bool) public isMinted;

    /***********************************|
    |            Constructor            |
    |__________________________________*/

    /**
     * @notice Create factory, link skyweaver assets and store initial parameters
     * @param _firstOwner      Address of the first owner
     * @param _assetsAddr      The address of the ERC-1155 Assets Token contract
     * @param _periodLength    Number of seconds each period lasts
     * @param _periodMintLimit Can only mint N assets per period
     * @param _whitelistOnly   Whether this factory uses a mint whitelist or not
     */
    constructor(
        address _firstOwner,
        address _assetsAddr,
        uint256 _periodLength,
        uint256 _periodMintLimit,
        bool _whitelistOnly
    )
        public
        RewardFactory(_firstOwner, _assetsAddr, _periodLength, _periodMintLimit, _whitelistOnly)
    {} // solhint-disable-line no-empty-blocks

    /***********************************|
    |            Mint Functions         |
    |__________________________________*/

    /**
     * @notice Will mint tokens to user
     * @dev Can only mint up to the periodMintLimit in a given 6hour period
     * @dev Can only mint each token id once
     * @param _to      The address that receives the assets
     * @param _ids     Array of Tokens ID that are minted
     * @param _amounts Amount of Tokens id minted for each corresponding Token id in _ids
     * @param _data    Byte array passed to recipient if recipient is a contract
     */
    function batchMint(address _to, uint256[] calldata _ids, uint256[] calldata _amounts, bytes calldata _data)
        public
        override
    {
        // Each id can only be minted once
        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 id = _ids[i];
            require(!isMinted[id], "ExclusiveRewardFactory#batchMint: ID_ALREADY_MINTED");
            require(_amounts[i] == 1, "ExclusiveRewardFactory#batchMint: NON_EXCLUSIVE_MINTING");
            isMinted[id] = true;
        }

        super.batchMint(_to, _ids, _amounts, _data);
    }
}
