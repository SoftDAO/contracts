// SPDX-License-Identifier: MIT
pragma solidity =0.8.16;

import { IERC721, ERC721, IERC165 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import { IAbstractToken, IAbstractERC721, AbstractTokenMessage } from '../interfaces/IAbstractToken.sol';
import { AbstractToken } from './AbstractToken.sol';

contract AbstractERC721 is AbstractToken, ERC721, IAbstractERC721 {
  constructor(
    string memory _name,
    string memory _symbol,
    uint256 supply,
    address _signer
  ) ERC721(_name, _symbol) AbstractToken(_signer) {
    _mint(msg.sender, supply);
  }
    function _validMeta(bytes calldata metadata) internal pure override returns (bool) {
    /** ERC721 metadata
       - id: uint256 - not applicable
       - amount: not applicable
       - uri: string
      */
    return metadata.length > 32;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool) {
    return
      type(IAbstractERC721).interfaceId == interfaceId ||
      type(IAbstractToken).interfaceId == interfaceId ||
      super.supportsInterface(interfaceId);
  }

  function id(AbstractTokenMessage calldata message) public pure returns (uint256) {
    require(_validMeta(message.meta), 'invalid metadata');
    // metadata for ERC721 tokens includes the amount and uri
    return uint256(bytes32(message.meta));
  }

  function amount(AbstractTokenMessage calldata message) public pure returns (uint256) {
    require(_validMeta(message.meta), 'invalid metadata');
    // the only metadata for ERC20 tokens is the amount
    revert('ERC721 tokens have no amount');
  }

  function uri(AbstractTokenMessage calldata message) public pure returns (string calldata) {
    require(_validMeta(message.meta), 'invalid metadata');
    return string(message.meta[32:message.meta.length]);
  }

  // transforms token(s) from message to contract
  function _reify(AbstractTokenMessage calldata message) internal override(AbstractToken) {
    // URI must match
    require(_equal(tokenURI(id(message)), uri(message)), 'uri mismatch');
    _mint(message.owner, id(message));
  }

  // transforms token(s) from contract to message
  function _dereify(AbstractTokenMessage calldata message) internal override(AbstractToken) {
    // no permission checking! Callers must validate the message!
    _burn(id(message));
  }

  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _id,
    bytes calldata _data,
    AbstractTokenMessage calldata message
  ) external {
    reify(message);
    safeTransferFrom(_from, _to, _id, _data);
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _id,
    AbstractTokenMessage calldata message
  ) external {
    reify(message);
    transferFrom(_from, _to, _id);
  }
}
