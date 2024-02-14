
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Mintable Registry Tests", function () {
    let contract;

    let owner;
    let addr1;
    let addr2;
    let receiver;
    let signer;
    let addrs;

    beforeEach(async function () {
        [owner, addr1, addr2, receiver, signer, ...addrs] = await ethers.getSigners();

        let factory = await ethers.getContractFactory("SelfkeyMintableRegistry");
        contract = await upgrades.deployProxy(factory, []);
        await contract.deployed();

        await expect(contract.connect(owner).changeAuthorizedSigner(signer.address, { from: owner.address }))
                .to.emit(contract, 'AuthorizedSignerChanged').withArgs(signer.address);

    });

    describe("Upgradeability", function() {
        it("Should upgrade correctly", async function() {
            [owner, addr1, addr2, receiver, signer, ...addrs] = await ethers.getSigners();

            let factory = await ethers.getContractFactory("SelfkeyMintableRegistryV2");
            contract = await upgrades.deployProxy(factory, []);
            await contract.deployed();

            let factory2 = await ethers.getContractFactory("SelfkeyMintableRegistry");
            const upgradedContract = await upgrades.upgradeProxy(contract.address, factory2);

            await expect(upgradedContract.connect(owner).addAuthorizedCaller(signer.address, { from: owner.address }))
                .to.emit(upgradedContract, 'AuthorizedCallerAdded').withArgs(signer.address);

        });
    });


    describe("Deployment", function() {
        it("Deployed correctly and authorized signer was assigned", async function() {
            expect(await contract.authorizedSigner()).to.equal(signer.address);
        });
    });

    describe("Governance", function() {
        it("Owner can change signer", async function() {
            await contract.changeAuthorizedSigner(addr1.address);
            expect(await contract.authorizedSigner()).to.equal(addr1.address);
        });

        it("Random wallet cannot change signer", async function() {
            await expect(contract.connect(addr2).changeAuthorizedSigner(addr1.address, { from: addr2.address }))
                .to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("Register a reward", function() {
        it("Authorized signer can register a reward", async function() {
            const _account = addr2.address;
            const _amount = 100;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);
        });

        it("Balance is updated after registration", async function() {
            const _account = addr2.address;
            const _amount = 100;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);

            expect(await contract.balanceOf(_account)).to.equal(_amount);
        });

        it("Earned is updated after registration", async function() {
            const _account = addr2.address;
            const _amount = 200;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);

            expect(await contract.balanceOfEarned(_account)).to.equal(_amount);
        });

        it("Non-authorized signer cannot register a reward", async function() {
            const _account = addr2.address;
            const _amount = 100;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            await expect( contract.connect(addr1).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.be.revertedWith('Not authorized to register');
        });
    });


    describe("Register minting", function() {
        it("Authorized signer can register a reward", async function() {
            const _account = addr2.address;
            const _amount = ethers.utils.parseEther('100000000000000000000');
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);

            expect(await contract.connect(signer).registerMinting(_account, _amount))
                .to.emit('MintingRegistered').withArgs(_account, _amount);
        });

        it("Cannot mint more than earned", async function() {
            const _account = addr2.address;
            const _amount = 100;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);

            const _mint_amount = 120;

            await expect(contract.connect(signer).registerMinting(_account, _mint_amount))
                .to.be.revertedWith('Not enough balance');
        });

        it("Balance is updated after minting", async function() {
            const _account = addr2.address;
            const _amount = ethers.utils.parseEther('100000000000000000000');;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);

            const _mint_amount = ethers.utils.parseEther('50000000000000000000');;

            expect(await contract.connect(signer).registerMinting(_account, _mint_amount))
                .to.emit('MintingRegistered').withArgs(_account, _mint_amount);


            expect(await contract.balanceOf(_account)).to.equal(_amount.sub(_mint_amount));
        });

        it("Minted is updated after minting", async function() {
            const _account = addr2.address;
            const _amount = 100;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);

            const _mint_amount = 50;

            expect(await contract.connect(signer).registerMinting(_account, _mint_amount))
                .to.emit('MintingRegistered').withArgs(_account, _mint_amount);


            expect(await contract.balanceOfMinted(_account)).to.equal(_mint_amount);
        });

        it("Non-authorized signer cannot register a reward", async function() {
            const _account = addr2.address;
            const _amount = 100;
            const _task = 'Code Submission';
            const _task_id = 1;
            const _signer = addr1.address;

            expect(await contract.connect(signer).registerReward(_account, _amount, _task, _task_id, _signer))
                .to.emit('RewardRegistered').withArgs(_account, _amount, _task, _task_id);

            const _mint_amount = 50;

            await expect(contract.connect(addr2).registerMinting(_account, _mint_amount))
                .to.be.revertedWith('Not an authorized caller or signer')

        });

    });

});

