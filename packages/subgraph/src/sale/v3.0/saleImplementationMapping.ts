import {
  ImplementationConstructor,
  FlatPriceSale_v_3 as FlatPriceSaleContract
} from "../../../generated/FlatPriceSale_v_3/FlatPriceSale_v_3";
import {
  SaleImplementation
} from "../../../generated/schema";
import { log, BigInt } from '@graphprotocol/graph-ts'

export function handleImplementationConstructor(event: ImplementationConstructor): void {
  const saleImplementationId = event.address.toHexString();

  const implementation = new SaleImplementation(saleImplementationId);
  const implementationContract = FlatPriceSaleContract.bind(event.address);

  implementation.networkConfig = event.params.networkConfig.toHexString();
  implementation.saleCount = BigInt.fromI32(0);
  implementation.purchaseCount = BigInt.fromI32(0);
  const versionResult = implementationContract.try_VERSION();

  if (versionResult.reverted) {
    log.error('could not call VERSION() on implementation at {} in tx {}', [saleImplementationId, event.transaction.hash.toHexString()]);
    return;
  }

  implementation.version = versionResult.value;
  implementation.createdAt = event.block.timestamp;
  implementation.save();
}
