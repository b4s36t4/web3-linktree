import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-storage-layout";
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
};

export default config;
