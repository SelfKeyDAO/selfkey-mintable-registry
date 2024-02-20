const { ethers, upgrades } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // const proxyAddress = "0xfAA8d6Ce9A457567bF81c00496DfC07959025bA4"; // Mumbai
    const proxyAddress = "0x64450DA938d06bE7EEc68E4Ead99FfF05D8Cebe7"; // Polygon

    const contractFactory = await hre.ethers.getContractFactory("SelfkeyMintableRegistry");
    const contract = await upgrades.upgradeProxy(proxyAddress, contractFactory, { timeout: 500000 });
    await contract.deployed();

    console.log("Deployed contract address:", contract.address);

    // INFO: verify contract after deployment
    // npx hardhat verify --network polygon 0x64450DA938d06bE7EEc68E4Ead99FfF05D8Cebe7
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
