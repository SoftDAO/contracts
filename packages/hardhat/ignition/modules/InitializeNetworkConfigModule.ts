import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import FeeLevelJudgeStubModule from "./FeeLevelJudgeStubModule";
import NetworkConfigModule from "./NetworkConfigModule";

export default buildModule("InitializeNetworkConfigModule", m => {
  const { feeLevelJudgeStub } = m.useModule(FeeLevelJudgeStubModule);
  const { networkConfig } = m.useModule(NetworkConfigModule);

  let oracleMock

  if (process.env.NETWORK_CONFIG_MOCK_ORACLE === 'true') {
    oracleMock = m.contract('OracleMock')
  }

  m.call(networkConfig, "initialize", [
    process.env.NETWORK_CONFIG_FEE_RECIPIENT ?? m.getParameter("NETWORK_CONFIG_FEE_RECIPIENT"),
    feeLevelJudgeStub,
    oracleMock ? oracleMock : m.getParameter("NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS"),
    oracleMock ? 1000000000000 : m.getParameter("NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_HEARTBEAT"),
    process.env.NETWORK_CONFIG_ACCESS_AUTHORITY_ADDRESS ?? m.getParameter("NETWORK_CONFIG_ACCESS_AUTHORITY_ADDRESS"),
  ]);

  return { networkConfig };
});
