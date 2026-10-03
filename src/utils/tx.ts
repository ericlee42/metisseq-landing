import oracleAbi from '@/configs/abi/oracle.json';
import { contracts } from '@/configs/common';
import { txPublicClients } from '@/configs/wallet';
import { Abi, Address, Chain, encodeFunctionData, Hex, WalletClient } from 'viem';

export interface SendTxInterface {
  walletClient: WalletClient;
  to: Address;
  chain: Chain;
  account?: Address;
  value?: bigint;
  data?: Hex;
}

export const calTxData = ({
  abi,
  functionName,
  args,
}: {
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
}) => {
  const data = encodeFunctionData({
    abi,
    functionName,
    args: args || [],
  });

  return data;
};

export const txAwait = async (hash: Hex, chainId: number, confirmations?: number) => {
  if (!hash) {
    throw new Error('Invalid hash');
  }
  if (!chainId) {
    throw new Error('Unsupported Chain');
  }

  const txPublicClient = txPublicClients[chainId.toString()];
  if (!txPublicClient) {
    throw new Error('Unsupported Chain');
  }
  const transaction = await txPublicClient.waitForTransactionReceipt({
    hash: hash as `0x${string}`,
    confirmations: confirmations || 1,
  });
  if (transaction.status !== 'success') {
    throw new Error('Transaction Failed');
  }
  return transaction;
};

export const sendTx = async ({ walletClient, to, account, value = 0n, data, chain }: SendTxInterface) => {
  const sender = account || walletClient.account?.address;
  if (!sender) throw new Error('Invalid Account');
  const client = txPublicClients[chain.id];
  if (!client || (await walletClient.getChainId()) !== chain.id) throw new Error('Unsupported Chain');
  const request = { to, account: sender, value, data, chain };
  await client.estimateGas(request);
  return walletClient.sendTransaction(request);
};

export const getL2GasFee = async ({ chainId }: { chainId: string | number }) => {
  if (!chainId) {
    throw new Error('Unsupported Chain');
  }

  const txPublicClient = txPublicClients[Number(chainId)];
  if (!txPublicClient) throw new Error('Unsupported Chain');

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

  const l2Fee = l2Gas * (discount as bigint);

  return {
    l2Fee,
    l2Gas,
  };
};
