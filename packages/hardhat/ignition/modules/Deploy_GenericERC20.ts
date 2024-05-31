import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployGenericERC20Module = buildModule("DeployGenericERC20Module", m => {
  const _name = m.getParameter("_name", "My New Token");
  const _symbol = m.getParameter("_symbol", "ABC");
  const _decimals = m.getParameter("_decimals", 18);
  const supply = m.getParameter("supply", 1_000_000_000n);

  const genericERC20 = m.contract("GenericERC20", [_name, _symbol, _decimals, supply]);

  return { genericERC20 };
});

export default DeployGenericERC20Module;

// Example 1

/**
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Apollo", (m) => {
  const apollo = m.contract("Rocket", ["Saturn V"]);

  m.call(apollo, "launch", []);

  return { apollo };
});

// Example 2
*/

/**
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const LockModule = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  const lock = m.contract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  return { lock };
});

export default LockModule;
*/
