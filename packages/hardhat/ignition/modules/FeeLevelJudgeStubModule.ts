import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FeeLevelJudgeStub", m => {
  const feeLevelJudgeStub = m.contract("FeeLevelJudgeStub", [100]);

  return { feeLevelJudgeStub };
});
