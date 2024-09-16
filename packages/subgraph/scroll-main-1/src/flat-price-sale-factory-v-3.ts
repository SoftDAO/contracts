import {
  NewSale as NewSaleEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/FlatPriceSaleFactory_v_3/FlatPriceSaleFactory_v_3"
import { NewSale, OwnershipTransferred } from "../generated/schema"

export function handleNewSale(event: NewSaleEvent): void {
  let entity = new NewSale(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation
  entity.clone = event.params.clone
  entity.config_recipient = event.params.config.recipient
  entity.config_merkleRoot = event.params.config.merkleRoot
  entity.config_saleMaximum = event.params.config.saleMaximum
  entity.config_userMaximum = event.params.config.userMaximum
  entity.config_purchaseMinimum = event.params.config.purchaseMinimum
  entity.config_startTime = event.params.config.startTime
  entity.config_endTime = event.params.config.endTime
  entity.config_maxQueueTime = event.params.config.maxQueueTime
  entity.config_URI = event.params.config.URI
  entity.baseCurrency = event.params.baseCurrency
  entity.nativeOracle = event.params.nativeOracle
  entity.nativeOracleHeartbeat = event.params.nativeOracleHeartbeat
  entity.nativePaymentsEnabled = event.params.nativePaymentsEnabled

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
