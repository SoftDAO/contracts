import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NewSale,
  OwnershipTransferred
} from "../generated/FlatPriceSaleFactory_v_3/FlatPriceSaleFactory_v_3"

export function createNewSaleEvent(
  implementation: Address,
  clone: Address,
  config: ethereum.Tuple,
  baseCurrency: string,
  nativeOracle: Address,
  nativeOracleHeartbeat: BigInt,
  nativePaymentsEnabled: boolean
): NewSale {
  let newSaleEvent = changetype<NewSale>(newMockEvent())

  newSaleEvent.parameters = new Array()

  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam("clone", ethereum.Value.fromAddress(clone))
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam("config", ethereum.Value.fromTuple(config))
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "baseCurrency",
      ethereum.Value.fromString(baseCurrency)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "nativeOracle",
      ethereum.Value.fromAddress(nativeOracle)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "nativeOracleHeartbeat",
      ethereum.Value.fromUnsignedBigInt(nativeOracleHeartbeat)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "nativePaymentsEnabled",
      ethereum.Value.fromBoolean(nativePaymentsEnabled)
    )
  )

  return newSaleEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
