import { BigNumber } from '@ethersproject/bignumber';
import * as chai from 'chai';
const chaiAsPromised = require('chai-as-promised');
import { ethers } from 'hardhat';

chai.use(chaiAsPromised);

describe('eshare contract', function() {
    it ('owner is deployer', async function() {
        const [deployer, owner] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(owner.address);

        const ownerAddress = await token.owner();

        chai.expect(ownerAddress).equals(owner.address);
    });

    it ('total cap to be 0', async function() {
        const [deployer, owner] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(owner.address);
        
        const totalSupply = await token.totalSupply();
        
        chai.expect(BigNumber.from(0).eq(totalSupply)).true;
    });
    
    it ('total cap to be increase to 1000 when mint', async function() {
        const [deployer, owner] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(deployer.address);
        
        await token.mint(owner.address, (BigNumber.from(10).pow(18).mul(1000)));
        const totalSupply = await token.totalSupply();
        
        chai.expect(BigNumber.from(10).pow(18).mul(1000).eq(totalSupply)).true;
    });

    it ('Balance of owner to be increase to 1000 when mint', async function() {
        const [deployer, owner] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(deployer.address);
        
        await token.mint(owner.address, (BigNumber.from(10).pow(18).mul(1000)));
        const balanceOfOwner = await token.balanceOf(owner.address);
        
        chai.expect(BigNumber.from(10).pow(18).mul(1000).eq(balanceOfOwner)).true;
    });

    it ('Balance of 0x606f86D79edE6C04DD583FE89b64eF010405D462 to be increase to 2000 when mint', async function() {
        const [deployer, owner] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(deployer.address);
        
        await token.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        await token.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        const balanceOfTheAddress = await token.balanceOf("0x606f86D79edE6C04DD583FE89b64eF010405D462");
        
        chai.expect(BigNumber.from(10).pow(18).mul(2000).eq(balanceOfTheAddress)).true;
    });

     it ('size of Holders return 2 elements', async function() {
        const [deployer, owner] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(deployer.address);
        
        await token.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        await token.mint("0x807077b53eFa797D64E2158704427ac82a055aFC", (BigNumber.from(10).pow(18).mul(5000)));
        const sizeOfHolders = await token.getHoldersSize();
        chai.expect(BigNumber.from(2).eq(sizeOfHolders)).true;
    }); 

    it ('size of Holders return 3 element', async function() {
        const [deployer, owner] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(deployer.address);
        
        await token.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        await token.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        await token.mint("0x807077b53eFa797D64E2158704427ac82a055aFC", (BigNumber.from(10).pow(18).mul(5000)));
        await token.mint("0x807077b53eFa797D64E2158704427ac82a055aFC", (BigNumber.from(10).pow(18).mul(5000)));
        await token.mint("0x485FF8C2F51Dd9ee66d0190a86dC764E3029C647", (BigNumber.from(10).pow(18).mul(5000)));
        const sizeOfHolders = await token.getHoldersSize();
        chai.expect(BigNumber.from(3).eq(sizeOfHolders)).true;
    }); 

     it ('size of Holders return 1 element', async function() {
        const [deployer, owner] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("FTXFEshare", deployer);
        const token = await Token.deploy(deployer.address);
        
        await token.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        await token.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        const sizeOfHolders = await token.getHoldersSize();
        chai.expect(BigNumber.from(1).eq(sizeOfHolders)).true;
    }); 

   

    it ('test payDividend FTXF token', async function() {
        const [deployer, owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("FTXFToken", deployer);
        const token = await Token.deploy(deployer.address);
        
        const EshareToken = await ethers.getContractFactory("FTXFEshare", deployer);
        const eshareToken = await EshareToken.deploy(deployer.address);
        await eshareToken.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(1000)));
        await token.transfer(eshareToken.address,1000);

        await eshareToken.payDividend(1000, token.address);
        const balance =  await token.balanceOf("0x606f86D79edE6C04DD583FE89b64eF010405D462");
        chai.expect(BigNumber.from(10).pow(3)).eq(balance);

    });

    it ('test payDividend function to transfer 1000 FTXF token commision for 3 address', async function() {
        const [deployer, owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("FTXFToken", deployer);
        const token = await Token.deploy(deployer.address);
        
        const EshareToken = await ethers.getContractFactory("FTXFEshare", deployer);
        const eshareToken = await EshareToken.deploy(deployer.address);

        await eshareToken.mint("0x606f86D79edE6C04DD583FE89b64eF010405D462", (BigNumber.from(10).pow(18).mul(800)));
        await eshareToken.mint("0x807077b53eFa797D64E2158704427ac82a055aFC", (BigNumber.from(10).pow(18).mul(200)));
        await eshareToken.mint("0x67d363462107Df2ac71D665ca13C2c0D5937C8e9", (BigNumber.from(10).pow(18).mul(500)));
        await token.transfer(eshareToken.address,10000000);
        
        await eshareToken.payDividend(1000, token.address);
        const balance1 =  await token.balanceOf("0x606f86D79edE6C04DD583FE89b64eF010405D462");
        const balance2 =  await token.balanceOf("0x807077b53eFa797D64E2158704427ac82a055aFC");
        const balance3 =  await token.balanceOf("0x67d363462107Df2ac71D665ca13C2c0D5937C8e9");
          
        chai.expect(BigNumber.from(533)).eq(balance1);
    });

});
