import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { vars } from "hardhat/config";

import FeeLevelJudgeStubModule from "./FeeLevelJudgeStubModule";
import NetworkConfigModule from "./NetworkConfigModule";

export default buildModule("InitializeNetworkConfigModule", m => {
  const { feeLevelJudgeStub } = m.useModule(FeeLevelJudgeStubModule);
  const { networkConfig } = m.useModule(NetworkConfigModule);

  m.call(networkConfig, "initialize", [
    vars.get("NETWORK_CONFIG_FEE_RECIPIENT"),
    feeLevelJudgeStub,
    vars.get("NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS"),
    vars.get("NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_HEARTBEAT"),
    vars.get("NETWORK_CONFIG_ACCESS_AUTHORITY_ADDRESS"),
  ]);

  return { networkConfig };
});
