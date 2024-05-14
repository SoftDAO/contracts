// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Claim extends ethereum.Event {
  get params(): Claim__Params {
    return new Claim__Params(this);
  }
}

export class Claim__Params {
  _event: Claim;

  constructor(event: Claim) {
    this._event = event;
  }

  get beneficiary(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class InitializeDistributionRecord extends ethereum.Event {
  get params(): InitializeDistributionRecord__Params {
    return new InitializeDistributionRecord__Params(this);
  }
}

export class InitializeDistributionRecord__Params {
  _event: InitializeDistributionRecord;

  constructor(event: InitializeDistributionRecord) {
    this._event = event;
  }

  get beneficiary(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class InitializeDistributor extends ethereum.Event {
  get params(): InitializeDistributor__Params {
    return new InitializeDistributor__Params(this);
  }
}

export class InitializeDistributor__Params {
  _event: InitializeDistributor;

  constructor(event: InitializeDistributor) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get total(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get fractionDenominator(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get uri(): string {
    return this._event.parameters[3].value.toString();
  }
}

export class InitializeDistributor1 extends ethereum.Event {
  get params(): InitializeDistributor1__Params {
    return new InitializeDistributor1__Params(this);
  }
}

export class InitializeDistributor1__Params {
  _event: InitializeDistributor1;

  constructor(event: InitializeDistributor1) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get total(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get uri(): string {
    return this._event.parameters[2].value.toString();
  }

  get fractionDenominator(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class IDistributorPatched__getDistributionRecordResultValue0Struct extends ethereum.Tuple {
  get initialized(): boolean {
    return this[0].toBoolean();
  }

  get total(): BigInt {
    return this[1].toBigInt();
  }

  get claimed(): BigInt {
    return this[2].toBigInt();
  }
}

export class IDistributorPatched extends ethereum.SmartContract {
  static bind(address: Address): IDistributorPatched {
    return new IDistributorPatched("IDistributorPatched", address);
  }

  NAME(): string {
    let result = super.call("NAME", "NAME():(string)", []);

    return result[0].toString();
  }

  try_NAME(): ethereum.CallResult<string> {
    let result = super.tryCall("NAME", "NAME():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  VERSION(): BigInt {
    let result = super.call("VERSION", "VERSION():(uint256)", []);

    return result[0].toBigInt();
  }

  try_VERSION(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("VERSION", "VERSION():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getClaimableAmount(beneficiary: Address): BigInt {
    let result = super.call(
      "getClaimableAmount",
      "getClaimableAmount(address):(uint256)",
      [ethereum.Value.fromAddress(beneficiary)]
    );

    return result[0].toBigInt();
  }

  try_getClaimableAmount(beneficiary: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getClaimableAmount",
      "getClaimableAmount(address):(uint256)",
      [ethereum.Value.fromAddress(beneficiary)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getDistributionRecord(
    beneficiary: Address
  ): IDistributorPatched__getDistributionRecordResultValue0Struct {
    let result = super.call(
      "getDistributionRecord",
      "getDistributionRecord(address):((bool,uint120,uint120))",
      [ethereum.Value.fromAddress(beneficiary)]
    );

    return changetype<
      IDistributorPatched__getDistributionRecordResultValue0Struct
    >(result[0].toTuple());
  }

  try_getDistributionRecord(
    beneficiary: Address
  ): ethereum.CallResult<
    IDistributorPatched__getDistributionRecordResultValue0Struct
  > {
    let result = super.tryCall(
      "getDistributionRecord",
      "getDistributionRecord(address):((bool,uint120,uint120))",
      [ethereum.Value.fromAddress(beneficiary)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<IDistributorPatched__getDistributionRecordResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  getFractionDenominator(): BigInt {
    let result = super.call(
      "getFractionDenominator",
      "getFractionDenominator():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getFractionDenominator(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getFractionDenominator",
      "getFractionDenominator():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  token(): Address {
    let result = super.call("token", "token():(address)", []);

    return result[0].toAddress();
  }

  try_token(): ethereum.CallResult<Address> {
    let result = super.tryCall("token", "token():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  total(): BigInt {
    let result = super.call("total", "total():(uint256)", []);

    return result[0].toBigInt();
  }

  try_total(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("total", "total():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  uri(): string {
    let result = super.call("uri", "uri():(string)", []);

    return result[0].toString();
  }

  try_uri(): ethereum.CallResult<string> {
    let result = super.tryCall("uri", "uri():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}