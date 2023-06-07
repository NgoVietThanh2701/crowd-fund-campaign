const path = require("path");
require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
  },
  mocha: {
    useColors: true,
  },
  compilers: {
    solc: {
      version: "^0.8.1",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200, // Default: 200
        },
      },
    },
  },
};
