import { calTxData, getL2GasFee, sendTx, txAwait } from '@/utils/tx';
import { decodeFunctionData, erc20Abi, type Address, type WalletClient } from 'viem';
import { mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const rpc = vi.hoisted(() => ({ estimateGas: vi.fn(), waitForTransactionReceipt: vi.fn(), readContract: vi.fn() }));
vi.mock('@/configs/wallet', () => ({ txPublicClients: { 1: rpc } }));
const account = '0x0000000000000000000000000000000000000001' as Address;
const hash = `0x${'ab'.repeat(32)}` as const;
const sendTransaction = vi.fn();
const getChainId = vi.fn();
const wallet = { account: { address: account }, sendTransaction, getChainId } as unknown as WalletClient;
beforeEach(() => {
  vi.resetAllMocks();
  getChainId.mockResolvedValue(1);
  sendTransaction.mockResolvedValue(hash);
});
describe('transaction boundary', () => {
  it('encodes unlimited approval without loss of precision', () => {
    const data = calTxData({ abi: erc20Abi, functionName: 'approve', args: [account, 2n ** 256n - 1n] });
    expect(decodeFunctionData({ abi: erc20Abi, data }).args).toEqual([account, 2n ** 256n - 1n]);
  });
  it('estimates and sends identical bigint value and calldata', async () => {
    const value = 9007199254740993123456789n;
    await expect(sendTx({ walletClient: wallet, chain: mainnet, to: account, value, data: '0x1234' })).resolves.toBe(
      hash,
    );
    expect(rpc.estimateGas.mock.calls[0][0]).toEqual(sendTransaction.mock.calls[0][0]);
    expect(sendTransaction.mock.calls[0][0].value).toBe(value);
  });
  it('does not send on chain mismatch or estimate failure', async () => {
    getChainId.mockResolvedValue(11155111);
    await expect(sendTx({ walletClient: wallet, chain: mainnet, to: account })).rejects.toThrow('Unsupported Chain');
    getChainId.mockResolvedValue(1);
    rpc.estimateGas.mockRejectedValue(new Error('revert'));
    await expect(sendTx({ walletClient: wallet, chain: mainnet, to: account })).rejects.toThrow('revert');
    expect(sendTransaction).not.toHaveBeenCalled();
  });
  it('propagates wallet rejection and rejects reverted receipts', async () => {
    sendTransaction.mockRejectedValue(new Error('User rejected'));
    await expect(sendTx({ walletClient: wallet, chain: mainnet, to: account })).rejects.toThrow('User rejected');
    rpc.waitForTransactionReceipt.mockResolvedValue({ status: 'reverted' });
    await expect(txAwait(hash, 1)).rejects.toThrow('Transaction Failed');
    rpc.waitForTransactionReceipt.mockResolvedValue({ status: 'success' });
    await expect(txAwait(hash, 1, 2)).resolves.toEqual({ status: 'success' });
    expect(rpc.waitForTransactionReceipt).toHaveBeenLastCalledWith({ hash, confirmations: 2 });
  });
  it('calculates L2 fee using exact integers and preserves the gas margin', async () => {
    rpc.readContract
      .mockResolvedValueOnce(account)
      .mockResolvedValueOnce(80000n)
      .mockResolvedValueOnce(9007199254740993n);
    expect(await getL2GasFee({ chainId: 1 })).toEqual({ l2Gas: 100000n, l2Fee: 900719925474099300000n });
  });
});
