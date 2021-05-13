import { ethers, hardhatArguments } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';

//-----------------------------------------------------------------------------
// PARAMETER
// this should not included staking pools
const poolsInfo: { [index: string]: {address:string, share: number} } = 
    {
        'freezing & stake': {
            address: '0x2f03992091909DB03a4c39c1bb36aED9bAEbfC5E', // change these address to real wallet
            share: 420
        },
        'reserve fund': {
            address: '0x7625812eb52D6B358d48afAd29D2f24fD55C05B3',
            share: 182
        },
        'development team': {
            address: '0x354DD194403b0795E5be6bF0b841D81B2c0F6f31',
            share: 150
        },
        'marketing': {
            address: '0x79006B2840Ae368de487061655f25240c0b88C5C',
            share: 100
        },
        'community development': {
            address: '0x25B4fFEa548EdE74f68e6ccbC864CD8562E48865',
            share: 15
        },
        'advisory & legal board': {
            address: '0xc856C94E1b92862d348233B3ABEcE020de0A1e2B',
            share: 18
        }
        
    }   

// this will be total number of token mined from staking that cannot be exceeded
const stakeRewardCap = BigNumber.from(10).pow(18).mul(50000000); // change this to expected amount
// number of token per block, stakeRewardPerBlock = stakeRewardCap / time to mine (seconds) * 3
const stakeRewardPerBlock = stakeRewardCap.mul(3).div(86400 * 365).div(3);
// number of token for above pools, poolRewardPerBlock = totalRewardForPools / time to mine (seconds) * 3
const poolRewardPerBlock = BigNumber.from(10).pow(18); // change this later
//number of block to generate pool reward
const poolRewardEndIn = BigNumber.from(86400).mul(1000) // 1000 days
// sale price of token will be salePrice / salePriveDiv per token in wei
const salePrice = 660;
const salePriceDiv = 1;

//-----------------------------------------------------------------------------
    
function mapPoolToParam() {
    var addresses = [];
    var shares = [];
    for (var key in poolsInfo) {
        addresses.push(poolsInfo[key].address);
        shares.push(poolsInfo[key].share);
    }

    return [addresses, shares]
}

async function main() {
    
    const network = hardhatArguments.network ? hardhatArguments.network : 'dev';
    const [deployer] = await ethers.getSigners();
    console.log('deploy from address: ', deployer.address);

    const Token = await ethers.getContractFactory("FTXFToken");
    const token = await Token.deploy(deployer.address);
    console.log('FTXFToken address: ', token.address);
    const tokenAddress = token.address;

    const [pools, poolsShare] = mapPoolToParam();
    console.log([tokenAddress, pools, poolsShare, stakeRewardCap.toString(),
        stakeRewardPerBlock.toString(), poolRewardPerBlock.toString(), salePrice.toString(), salePriceDiv.toString(),poolRewardEndIn.toString()]);

    const Founder = await ethers.getContractFactory("Founder");
    const founder = await Founder.deploy(tokenAddress, pools, poolsShare, stakeRewardCap, 
        stakeRewardPerBlock, poolRewardPerBlock, salePrice, salePriceDiv, poolRewardEndIn);

   
    await token.transferOwnership(founder.address);

    console.log('Founder address: ', founder.address);

    const EshareToken = await ethers.getContractFactory("FTXFEshare");
    const eshareToken = await EshareToken.deploy(deployer.address);
    console.log('FTXFEshare address: ', eshareToken.address);
    
}

main().then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });