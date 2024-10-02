import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const networkConfigProxyModule = buildModule("NetworkConfigProxyModule", m => {
  const networkConfigProxyAdminOwner = m.getParameter("NETWORK_CONFIG_PROXY_ADMIN");

  // uninitialized implementation
  const networkConfig = m.contract("NetworkConfig");

  const networkConfigProxy = m.contract("TransparentUpgradeableProxy", [
    networkConfig,
    networkConfigProxyAdminOwner,
    "0x",
  ]);

  const networkConfigProxyAdminAddress = m.readEventArgument(networkConfigProxy, "AdminChanged", "newAdmin");

  const networkConfigProxyAdmin = m.contractAt("ProxyAdmin", networkConfigProxyAdminAddress);

  return { networkConfigProxyAdmin, networkConfigProxy };
});

const networkConfigModule = buildModule("NetworkConfigModule", m => {
  const { networkConfigProxyAdmin, networkConfigProxy } = m.useModule(networkConfigProxyModule);

  const networkConfig = m.contractAt("NetworkConfig", networkConfigProxy);

  return { networkConfig, networkConfigProxy, networkConfigProxyAdmin };
});

export default networkConfigModule;
