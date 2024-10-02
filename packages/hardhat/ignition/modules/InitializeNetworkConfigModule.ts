import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import FeeLevelJudgeStubModule from "./FeeLevelJudgeStubModule";
import NetworkConfigModule from "./NetworkConfigModule";

export default buildModule("InitializeNetworkConfigModule", m => {
  const { feeLevelJudgeStub } = m.useModule(FeeLevelJudgeStubModule);
  const { networkConfig } = m.useModule(NetworkConfigModule);

  m.call(networkConfig, "initialize", [
    m.getParameter("NETWORK_CONFIG_FEE_RECIPIENT"),
    feeLevelJudgeStub,
    m.getParameter("NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS"),
    m.getParameter("NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_HEARTBEAT"),
  ]);

  return { networkConfig };
});
