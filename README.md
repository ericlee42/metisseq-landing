## how to use

```bash
# install dependences
$ yarn install

# start service
$ yarn start

# test
$ yarn build:qa

# prod
$ yarn build
```

### Config
1. .env 文件 存有l1lock相关的合约地址、metis代币地址、l2相关chainId、rpc以及seq相关配置 
2. src/configs/common.ts 配置每条链的合约地址、abi、graph地址、浏览器、rpc
    1. contracts 配置合约、abi地址
    2. graphUrl 配置graph地址
    3. defaultChainId 配置未链接钱包时默认链
    4. l2Gas 配置l2Gas提交参数
    5. defaultRewardRecipient 配置默认奖励地址
    6. l2Provider 配置l2rpc节点

3. src/configs/wallet.ts 配置钱包相关信息
    1. chainId 配置当前允许使用的链
    2. txPublicClients 配置rpc节点（扫tx用）

### Deployment
1. yarn
2. yarn build / yarn build:qa



### Others
```
const { sequencerInfo, allSequencerInfo, run: sequencerInfoRun, cancel: sequencerInfoCancel, getAllUserRun } = useSequencerInfo();

// allSequencerInfo github中文的sequencer配置
// sequencerInfo 合约中sequencer信息
// useUpdate() 当前地址的一些基本信息
// useSequencerInfo() 当前seq的一些基本信息
```