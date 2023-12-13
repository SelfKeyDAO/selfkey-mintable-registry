# Selfkey Mintable Registry Contract

## Overview
Selfkey Mintable Registry. Hosted on sidechain.

## Development

All smart contracts are implemented in Solidity `^0.8.0`, using [Hardhat](https://hardhat.org/) as the Solidity development framework.

### Prerequisites

* [NodeJS](htps://nodejs.org), v16.1.0+
* [Hardhat](https://hardhat.org/), which is a comprehensive framework for Ethereum development.

### Initialization

    npm install

### Testing

    npx hardhat test

or with code coverage

    npx hardhat coverage


### Contract method interface

The following public functions are provided:


### Contract addresses

```
Polygon Mumbai: 0xfAA8d6Ce9A457567bF81c00496DfC07959025bA4
Polygon Mainnet:
Signer: 0x89145000ADBeCe9D1FFB26F645dcb0883bc5c3d9
```

### Deploying and upgrading contract

Deploy proxy and initial version of the contract
```
npx hardhat run scripts/deploy.js --network mumbai
```

### Verifying contract

```
npx hardhat verify --network mumbai <contract_address>
```

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).


## Team
