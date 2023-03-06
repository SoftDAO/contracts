// SPDX-License-Identifier: MIT
pragma solidity =0.8.16;

import { IERC165, ERC1155 } from '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import { IAbstractToken, IAbstractERC1155, AbstractTokenMessage, AbstractTokenMessageStatus } from '../interfaces/IAbstractToken.sol';
import { AbstractToken } from './AbstractToken.sol';

contract AbstractERC1155 is ERC1155, IAbstractERC1155, AbstractToken {
  constructor(
    string memory _uri,
    address _signer
) ERC1155(_uri) AbstractToken(_signer) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC1155) returns (bool) {
    return
      type(IAbstractERC1155).interfaceId == interfaceId ||
      type(IAbstractToken).interfaceId == interfaceId ||
      super.supportsInterface(interfaceId);
  }
  function _validMeta(bytes calldata metadata) internal pure override returns (bool) {
    /** ERC1155 metadata
       - id: uint256 - the ID of the token to mint
       - amount: uint256 - the number of tokens to mint
       - uri: string - the description of the token
      */
    return metadata.length > 64;
  }

  function id(AbstractTokenMessage calldata message) public pure returns (uint256) {
    require(_validMeta(message.meta), 'invalid metadata');
    return uint256(bytes32(message.meta[0:31]));
  }

  function amount(AbstractTokenMessage calldata message) public pure returns (uint256) {
    require(_validMeta(message.meta), 'invalid metadata');
    return uint256(bytes32(message.meta[32:63]));
  }

  function uri(AbstractTokenMessage calldata message) public pure returns (string calldata) {
    require(_validMeta(message.meta), 'invalid metadata');
    return string(message.meta[63:message.meta.length]);
  }

  // transforms token(s) from message to contract
  function _reify(AbstractTokenMessage calldata message) internal override(AbstractToken) {
    // checks - note there is no permission checking! Callers must validate the message!
    // URI must match
    uint256 tokenId = id(message);
    require(_equal(uri(tokenId), uri(message)), 'uri mismatch');
    _mint(message.owner, tokenId, amount(message), '');
  }

  // transforms token(s) from contract to message
  function _dereify(AbstractTokenMessage calldata message) internal override(AbstractToken) {
    // no permission checking! Callers must validate the message!
    _burn(message.owner, id(message), amount(message));
  }

  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _id,
    uint256 _amount,
    bytes calldata _data,
    AbstractTokenMessage calldata message
  ) external {
    reify(message);
    safeTransferFrom(_from, _to, _id, _amount, _data);
  }

  function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata data,
    AbstractTokenMessage[] calldata messages
  ) external {
    for (uint256 i = 0; i < messages.length; i++) {
      reify(messages[i]);
    }
    safeBatchTransferFrom(from, to, ids, amounts, data);
  }
}
