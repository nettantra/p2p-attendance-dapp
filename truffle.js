require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(
                    process.env.MNEMONIC,
                    `http://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
                )
            },
            gasPrice: 2500000000,
            network_id: "3",
            port: 8545
        },
        rinkeby:  {
            network_id: 4,
            host: "localhost",
            port:  8545,
            gas:   4700000
        },
        solc: {
            optimizer: {
                enable: true,
                runs: 200
            }
        }
    }
};

