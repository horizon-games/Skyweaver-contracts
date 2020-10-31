pragma solidity 0.6.8;

import "../utils/TieredOwnable.sol";
import "../interfaces/ISkyweaverAssets.sol";
import "multi-token-standard/contracts/utils/SafeMath.sol";
import "multi-token-standard/contracts/interfaces/IERC165.sol";

/**
 * @notice This is a contract allowing contract owner to mint up to N 
 *         assets per period of 6 hours.
 * @dev This contract should only be able to mint some asset types
 */
contract RewardFactory is TieredOwnable {
  using SafeMath for uint256;

  /***********************************|
  |             Variables             |
  |__________________________________*/

  // Token information
  ISkyweaverAssets immutable public skyweaverAssets; // ERC-1155 Skyweaver assets contract

  // Period variables
  uint256 internal period;                           // Current period
  uint256 internal availableSupply;                  // Amount of assets that can currently be minted
  uint256 public periodMintLimit;                    // Amount that can be minted within 6h
  uint256 constant internal PERIOD_LENGTH = 6 hours; // Length of each mint periods

  // Event
  event PeriodMintLimitChanged(uint256 oldMintingLimit, uint256 newMintingLimit);
  
  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Create factory, link skyweaver assets and store initial parameters
   * @param _firstOwner       Address of the first owner
   * @param _assetsAddr       The address of the ERC-1155 Assets Token contract
   * @param _periodMintLimit  Can only mint N assets per period
   */
  constructor(
    address _firstOwner,
    address _assetsAddr,
    uint256 _periodMintLimit
  ) TieredOwnable(_firstOwner) public {
    require(
      _assetsAddr != address(0) &&
      _periodMintLimit > 0,
      "RewardFactory#constructor: INVALID_INPUT"
    );

    // Assets
    skyweaverAssets = ISkyweaverAssets(_assetsAddr);

    // Set current period
    period = livePeriod();
    availableSupply = _periodMintLimit;

    // Rewards parameters
    periodMintLimit = _periodMintLimit;
    emit PeriodMintLimitChanged(0, _periodMintLimit);
  }


  /***********************************|
  |         Management Methods        |
  |__________________________________*/

  /**
   * @notice Will update the daily mint limit
   * @dev This change will take effect immediatly once executed
   * @param _newPeriodMintLimit Amount of assets that can be minted within a period
   */
  function updatePeriodMintLimit(uint256 _newPeriodMintLimit) external onlyOwnerTier(HIGHEST_OWNER_TIER) {
    // Immediately update supply instead of waiting for next period
    if (availableSupply > _newPeriodMintLimit) {
      availableSupply = _newPeriodMintLimit;
    }

    emit PeriodMintLimitChanged(periodMintLimit, _newPeriodMintLimit);
    periodMintLimit = _newPeriodMintLimit;
  }


  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  fallback () external {
    revert("RewardFactory#_: UNSUPPORTED_METHOD");
  }

  /***********************************|
  |         Minting Functions         |
  |__________________________________*/

  /**
   * @notice Will mint tokens to user
   * @dev Can only mint up to the periodMintLimit in a given 6hour period
   * @param _to      The address that receives the assets
   * @param _ids     Array of Tokens ID that are minted
   * @param _amounts Amount of Tokens id minted for each corresponding Token id in _ids
   * @param _data    Byte array passed to recipient if recipient is a contract
   */
  function batchMint(address _to, uint256[] calldata _ids, uint256[] calldata _amounts, bytes calldata _data)
    external onlyOwnerTier(1)
  {
    uint256 live_period = livePeriod();
    uint256 stored_period = period;
    uint256 available_supply;

    // Update period and refresh the available supply if period
    // is different, otherwise use current available supply.
    if (live_period == stored_period) {
      available_supply = availableSupply;
    } else {
      available_supply = periodMintLimit;
      period = live_period;
    }

    // If there is an insufficient available supply, this will revert
    for (uint256 i = 0; i < _ids.length; i++) {
      available_supply = available_supply.sub(_amounts[i]);
    }

    // Store available supply
    availableSupply = available_supply;
    
    // Mint assets
    skyweaverAssets.batchMint(_to, _ids, _amounts, _data);
  }


  /***********************************|
  |         Utility Functions         |
  |__________________________________*/

  /**
   * @notice Returns how many cards can currently be minted by this factory
   */
  function getAvailableSupply() external view returns (uint256) {
    return livePeriod() == period ? availableSupply : periodMintLimit;
  }

  /**
   * @notice Calculate the current period
   */
  function livePeriod() public view returns (uint256) {
    return now / PERIOD_LENGTH;
  }

  /**
   * @notice Indicates whether a contract implements a given interface.
   * @param interfaceID The ERC-165 interface ID that is queried for support.
   * @return True if contract interface is supported.
   */
  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return  interfaceID == type(IERC165).interfaceId;
  }
}
