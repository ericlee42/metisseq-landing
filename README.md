## how to use

```bash
# install dependencies
$ yarn install

# start service
$ yarn start

# test
$ yarn build:qa

# prod
$ yarn build
```

### Config

1. .env file contains l1lock related contract addresses, metis token address, l2 related chainId, rpc and seq related configurations
2. src/configs/common.ts configures contract addresses, abi, graph addresses, browsers, and rpc for each chain

   1. contracts configures contract and abi addresses
   2. graphUrl configures graph address
   3. defaultChainId configures the default chain when wallet is not connected
   4. l2Gas configures l2Gas submission parameters
   5. defaultRewardRecipient configures the default reward address
   6. l2Provider configures l2 rpc node

3. src/configs/wallet.ts configures wallet related information
   1. chainId configures the currently allowed chains
   2. txPublicClients configures rpc nodes (for scanning tx)

### Deployment

1. yarn
2. yarn build / yarn build:qa

### Others

```
const { sequencerInfo, allSequencerInfo, run: sequencerInfoRun, cancel: sequencerInfoCancel, getAllUserRun } = useSequencerInfo();

// allSequencerInfo sequencer configuration in github
// sequencerInfo sequencer information in contract
// useUpdate() some basic information of the current address
// useSequencerInfo() some basic information of the current seq
```
