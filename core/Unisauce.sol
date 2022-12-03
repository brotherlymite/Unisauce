// SPDX-License-Identifier: agpl-3.0
pragma solidity >=0.7.5;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import "./interfaces/IERC20.sol";

contract Unisauce {

    address constant DAI = 0xF285239F96c444AC2EB262269840477DDf1Df765;
    address constant WETH = 0x7ED4d01ad78ADa738CA03b6279BDcCC1c89c75fF;
    address public immutable nonfungiblePositionManager;

    struct Option {
        address seller;
        address buyer;
        uint256 strikePrice;
        uint256 expiry;
        uint256 premium;
        uint256 tokenId;
        bool isActivated;
    }

    Option coveredCallOption = Option(address(0), address(0), 0, 0, 0, 0, false);
    
    constructor(
        address seller,
        address _nonfungiblePositionManager
    )
    {
        // contract creater will be the initial covered call option seller
        coveredCallOption.seller = seller;
        nonfungiblePositionManager = _nonfungiblePositionManager;
        // hardcoded the option premium to 50 DAI
        coveredCallOption.premium = 50 * 1e18;
        coveredCallOption.isActivated = false;
    }

    function sellCoveredCall(
        uint256 token_id,
        uint256 strike_price,
        uint256 expiry
    ) external {
        require(msg.sender == coveredCallOption.seller, "Invalid option seller");
        coveredCallOption.strikePrice = strike_price;
        coveredCallOption.expiry = expiry;
        coveredCallOption.tokenId = token_id;
        INonfungiblePositionManager(nonfungiblePositionManager).transferFrom(
            coveredCallOption.seller,
            address(this),
            token_id
        );
    }

    function buyCoveredCall() external {
        require(coveredCallOption.isActivated == false, "Option already purchased");
        bool status = IERC20(DAI).transferFrom(
            msg.sender,
            address(this),
            coveredCallOption.premium
        );
        require(status, "Option premium fee failed to be received");
        coveredCallOption.buyer = msg.sender;
        coveredCallOption.isActivated = true;
    }

    function getOptionDetails() external view returns (Option memory option) {
        return coveredCallOption;
    }

    function exerciseCoveredCall() external {
        require(coveredCallOption.isActivated, "Option not yet purchased");
        require(block.timestamp > coveredCallOption.expiry, "Please wait till the option expires");
        uint256 currentPrice = getPrice();

        if (currentPrice > coveredCallOption.strikePrice) {
            // The option buyer bet is correct, postion is converted to DAI
            // unwrap v3 position
            uint128 liquidity = 100;
            INonfungiblePositionManager(nonfungiblePositionManager).collect(INonfungiblePositionManager.CollectParams(
                coveredCallOption.tokenId,
                address(this),
                0,
                liquidity
            ));
            (uint256 sellerAmountOwed, uint256 buyerAmountOwed) = calculateAmountWhenCrossesStrikePrice();
            IERC20(DAI).transfer(coveredCallOption.seller, coveredCallOption.premium + sellerAmountOwed);
            IERC20(DAI).transfer(coveredCallOption.buyer, buyerAmountOwed);
        } else if (currentPrice <= coveredCallOption.strikePrice) {
            // The option seller bet is correct and the option buyer gains nothing
            INonfungiblePositionManager(nonfungiblePositionManager).transferFrom(
                address(this),
                coveredCallOption.seller,
                coveredCallOption.tokenId
            );
            IERC20(DAI).transfer(coveredCallOption.seller, coveredCallOption.premium);
        }
    }

    // TODO: Calculate amount to be recieved by the option buyer and seller based on the premium and expiry
    function calculateAmountWhenCrossesStrikePrice() private pure returns (uint256 sellerAmountOwed, uint256 buyerAmountOwed) {
        // The strike price is assumed to be 1500$, which after crossing the seller receives 1100$ and buyer 200$
        return(1100 * 1e18, 200 * 1e18);
    }

    // TODO: Use TWAP Price instead of the spot price
    function getPrice()
        public
        view
        returns (uint256 price)
    {
        IUniswapV3Pool pool = IUniswapV3Pool(0xe33FB0AAda1208c1b96f8726b525ee6A885D4d3D);
        (uint160 sqrtPriceX96,,,,,,) =  pool.slot0();
        return sqrtPriceX96ToUint(sqrtPriceX96, 18);
    }

    function sqrtPriceX96ToUint(uint160 sqrtPriceX96, uint8 decimalsToken0)
    internal
    pure
    returns (uint256)
    {
        uint256 numerator1 = uint256(sqrtPriceX96) * uint256(sqrtPriceX96);
        uint256 numerator2 = 10**decimalsToken0;
        return FullMath.mulDiv(numerator1, numerator2, 1 << 192);
    }
}
