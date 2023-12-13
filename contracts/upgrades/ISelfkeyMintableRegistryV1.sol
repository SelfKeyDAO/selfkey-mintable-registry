// SPDX-License-Identifier: proprietary
pragma solidity 0.8.19;

interface ISelfkeyMintableRegistryV1 {
    event AuthorizedSignerChanged(address indexed _address);
    event RewardRegistered(address indexed _account, uint _amount, string _task, uint _task_id);
    event MintingRegistered(address indexed _account, uint _amount);

    function changeAuthorizedSigner(address _signer) external;
    function registerReward(address _account, uint256 _amount, string memory _task, uint _task_id, address _signer) external;
    function registerMinting(address _account, uint256 _amount) external;
    function earned(address _account) external view returns(uint);
    function minted(address _account) external view returns(uint);
    function balanceOf(address _account) external view returns(uint);
}
