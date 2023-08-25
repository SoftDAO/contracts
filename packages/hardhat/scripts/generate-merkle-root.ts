import fs from 'fs'
import { parseAccounts } from './merkle'
import BigNumber from 'bignumber.js'

const csv = require('csvtojson')

const DEFAULT_DECIMAL_PLACES = 20

let totalAmount = 0

// prevent scientific notation
BigNumber.config({ EXPONENTIAL_AT: 1e9 })

/**
 * Usage: yarn run generate-merkle-root <path to input json> <path to output merkle tree> <formatter> <delimiter>
 *
 * See packages/hardhat/scripts/sample_data/dev_wallets for example input json file.
 *
 * Input json files must meet the following requirements:
 *
 * Each entry is indexed with a unique key value (typically a wallet address)
 * Each entry must have a data array with at least one element in it
 * Each entry in the data array must consist of a name, type and value. See https://docs.soliditylang.org/en/v0.8.17/types.html for a list of valid solidity data types
 *
 * Custom fields may be added to each entry.  All custom fields will be included in the resulting merkle tree output file.
 *
 * {
 *   "0xfac9c60874eab932fa424e38f79a8b54f333e544": {    <---- UNIQUE KEY VALUE
 *       "someCustomKey": "someCustomValue",            <---- OPTIONAL CUSTOM FIELDS
 *       "data": [                                      <---- MANDATORY DATA ARRAY
 *       {
 *           "name": "index",                           <---- DATA FIELDS
 *           "type": "uint256",
 *           "value": 0
 *       },
 *       {
 *           "name": "beneficiary",
 *           "type": "address",
 *           "value": "0xfac9c60874eab932fa424e38f79a8b54f333e544"
 *       },
 *       {
 *           "name": "amount",
 *           "type": "uint256",
 *           "value": "5000000000000000000000"
 *       }
 *       ]
 *   }
 * }
 *
 */

async function main() {
    const myArgs = process.argv.slice(2);
    const inputFile = myArgs[0]
    const outputFile = myArgs[1]
    const format = myArgs[2] || 'addressonly' // valid values include multichain, indexed, addressonly
    const delimiter = myArgs[3] || '\t'

    let accounts;

    // crude file type detection
    if (inputFile.endsWith('.csv')) {
        const lines = await csv({noheader:true, delimiter: delimiter}).fromFile(inputFile)
        accounts = lines.reduce((obj, line, index) => {
            const address = line.field1.toLowerCase()

            switch(format) {
                case 'multichain':
                    obj[address] = buildMultiChainDistributorNode(line, index)
                    break
                case 'indexed':
                    obj[address] = buildIndexedDistributorNode(line, index)
                    break
                case 'loadtest':
                    obj[address] = buildLoadTestDistributorNode(line, index)
                    break
                case 'connext-preview':
                    obj[address] = buildConnextPreviewDistributorNode(line, index)
                    break
                default:
                    obj[address] = buildAddressOnlyNode(line, index)
                    break
            }

            return obj
        }, {})
    } else {
        accounts = JSON.parse(fs.readFileSync(inputFile, { encoding: 'utf8' }))
    }

    const tree = parseAccounts(accounts)
    const merkleOutputString = JSON.stringify(tree)
    fs.writeFileSync(outputFile, merkleOutputString, { encoding: 'utf8' })

    console.log('Merkle Root: ' + tree.merkleRoot)
    console.log('Total Amount: ' + totalAmount)
    console.log('Total Entries: ' + Object.keys(tree.claims).length)
}

function buildMultiChainDistributorNode(line: any, index: number) {
    const address = line.field1.toLowerCase()
    const amount = line.field2
    const domain = line.field3

    if (!amount || !domain) {
        throw new Error('Amount and Domain fields are required for multichain distributors')
    }

    return {
        index: index,
        address: address,
        data: [
            {
                name: "beneficiary",
                type: "address",
                value: address
            },
            {
                name: "amount",
                type: "uint256",
                value: amount
            },
            {
                name: "domain",
                type: "uint32",
                value: domain
            }
        ]
    }
}

function buildIndexedDistributorNode(line: any, index: number) {
    const address = line.field1.toLowerCase()
    const amount = line.field2

    return {
        index: index,
        address: address,
        data: [
            {
                name: "index",
                type: "uint256",
                value: index
            },
            {
                name: "beneficiary",
                type: "address",
                value: address
            },
            {
                name: "amount",
                type: "uint256",
                value: amount
            }
        ]
    }
}

function buildLoadTestDistributorNode(line: any, index: number) {
    const address = line.field1.toLowerCase()
    const amount = line.field4

    totalAmount += Number(amount)

    return {
        index: index,
        address: address,
        data: [
            {
                name: "index",
                type: "uint256",
                value: index
            },
            {
                name: "beneficiary",
                type: "address",
                value: address
            },
            {
                name: "amount",
                type: "uint256",
                value: amount
            }
        ]
    }
}

function buildConnextPreviewDistributorNode(line: any, index: number) {
    const address = line.field1.toLowerCase()
    const amount = line.field2.trim()

    totalAmount += Number(amount)

    return {
        index: index,
        address: address,
        data: [
            {
                name: "beneficiary",
                type: "address",
                value: address
            },
            {
                name: "amount",
                type: "uint256",
                value: amount
            },
            {
                name: "domain",
                type: "uint32",
                value: "1735353714"
            }
        ]
    }
}

function buildAddressOnlyNode(line: any, index: number) {
    const address = line.field1.toLowerCase()

    return {
        index: index,
        address: address
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
