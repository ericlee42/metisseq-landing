import { contracts } from '@/configs/common';
import { txPublicClients } from '@/configs/wallet';
import oracleAbi from '@/configs/abi/oracle.json';
import BigNumber from 'bignumber.js';
import {
  encodeFunctionData,
  Abi,
  decodeFunctionResult,
  decodeEventLog,
  WalletClient,
  Address,
  formatUnits,
  formatEther,
  toHex,
} from 'viem';

export interface SendTxInterface {
  walletClient: WalletClient;
  to: string | `0x${string}`;
  chain: any;
  account?: string | `0x${string}`;
  value?: string | `0x${string}`;
  data?: string | `0x${string}`;
}

export const calTxData = ({ abi, functionName, args }: { abi: Abi | any; functionName: string; args?: any[] }) => {
  const data = encodeFunctionData({
    abi,
    functionName,
    args: args || [],
  });

  return data;
};

export const decodeResultData = ({
  abi,
  functionName,
  data,
}: {
  abi: Abi | any;
  functionName: string;
  data: string;
}) => {
  const decodedData = decodeFunctionResult({
    abi,
    functionName,
    data: data as `0x${string}`,
  });

  return decodedData;
};

// {
//   "eventName": "CreateIncreaseMarketOrder",
//   "args": {
//       "user": "0x2D3330a520eb23CF207B1deF87AeACf03466Aa51",
//   }
// }
export const decodeEventData = ({
  abi,
  data,
  topics,
}: {
  abi: Abi | any;
  data: string;
  topics: string[];
}): {
  eventName: string;
  args: any;
} => {
  const decodedData = decodeEventLog({
    abi,
    data: data as any,
    topics: topics as any,
  });

  return decodedData;
};

export const decodeEventDataWithFunctionName = ({
  abi,
  eventName,
  topics,
}: {
  abi: Abi | any;
  eventName: string;
  topics: string[];
}) => {
  const decodedData = decodeEventLog({
    abi,
    eventName,
    topics: topics as any,
  });

  return decodedData;
};

export const txAwait = async (hash: string | `0x${string}`, chainId: number) => {
  if (!hash) {
    throw new Error('Invalid hash');
  }
  if (!chainId) {
    throw new Error('Invalid Clent');
  }
  try {
    const txPublicClient = txPublicClients[chainId.toString()];
    if (!txPublicClient) {
      throw new Error('Invalid Clent');
    }
    const transaction = await txPublicClient.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
    });
    // console.log('txAwait', transaction);
    if (transaction.status !== 'success') {
      throw new Error('Transaction Failed');
    }
    return transaction;
  } catch (e) {
    throw e;
  }
};

export const sendTx = async ({ walletClient, to, account, value, data, chain }: SendTxInterface) => {
  try {
    if (!walletClient) throw new Error('Invalid Account');
    let p: any = {
      to,
      value,
      data,
      chain,
      account: walletClient.account?.address,
      // chain: chainId[0],
    };
    if (account) {
      p.account = account;
    }
    if (value) {
      p.value = value;
    }
    if (data) {
      p.data = data;
    }
    if (chain) {
      p.chain = chain;
    }

    const chainId = chain?.id;

    const txPublicClient = txPublicClients[chainId.toString()];
    if (!txPublicClient) {
      throw new Error('Invalid Clent');
    }
    const gasEstimate = await txPublicClient.estimateGas({
      ...p,
    });

    const hash = await walletClient!.sendTransaction({
      ...p,
    });
    return hash;
  } catch (e) {
    throw e;
  }
};

export const getL2GasFee = async ({ chainId }: { chainId: string | number }) => {
  if (!chainId) {
    throw new Error('Invalid Clent');
  }
  try {
    const txPublicClient = txPublicClients[chainId.toString()];

    const oracleAddress = await txPublicClient?.readContract({
      address: contracts?.lockAddressManager?.[chainId?.toString()]?.address,
      abi: contracts?.lockAddressManager?.[chainId?.toString()]?.abi,
      functionName: 'getAddress',
      args: ['MVM_DiscountOracle'],
    });

    let l2Gas = (await txPublicClient?.readContract({
      address: oracleAddress as Address,
      abi: oracleAbi,
      functionName: 'getMinL2Gas',
      args: [],
    })) as bigint;

    l2Gas = l2Gas + 20_000n;

    const discount = await txPublicClient?.readContract({
        address: oracleAddress as Address,
        abi: oracleAbi,
        functionName: 'getDiscount',
        args: [],
      });

    const l2Fee = BigNumber(l2Gas?.toString?.() || 0)
      .multipliedBy(discount?.toString?.() || 0)
      .toString();

    return {
      l2Fee,
      l2Gas,
    };
  } catch (e) {
    throw e;
  }
};
