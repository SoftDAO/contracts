import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { NewSale } from "../generated/schema"
import { NewSale as NewSaleEvent } from "../generated/FlatPriceSaleFactory_v_3/FlatPriceSaleFactory_v_3"
import { handleNewSale } from "../src/flat-price-sale-factory-v-3"
import { createNewSaleEvent } from "./flat-price-sale-factory-v-3-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let implementation = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let clone = Address.fromString("0x0000000000000000000000000000000000000001")
    let config = "ethereum.Tuple Not implemented"
    let baseCurrency = "Example string value"
    let nativeOracle = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let nativeOracleHeartbeat = BigInt.fromI32(234)
    let nativePaymentsEnabled = "boolean Not implemented"
    let newNewSaleEvent = createNewSaleEvent(
      implementation,
      clone,
      config,
      baseCurrency,
      nativeOracle,
      nativeOracleHeartbeat,
      nativePaymentsEnabled
    )
    handleNewSale(newNewSaleEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewSale created and stored", () => {
    assert.entityCount("NewSale", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewSale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "implementation",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NewSale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "clone",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NewSale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "config",
      "ethereum.Tuple Not implemented"
    )
    assert.fieldEquals(
      "NewSale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "baseCurrency",
      "Example string value"
    )
    assert.fieldEquals(
      "NewSale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "nativeOracle",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NewSale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "nativeOracleHeartbeat",
      "234"
    )
    assert.fieldEquals(
      "NewSale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "nativePaymentsEnabled",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
