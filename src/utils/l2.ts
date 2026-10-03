import type { Abi, Address, PublicClient } from 'viem';

export interface Epoch {
  number: bigint;
  signer: Address;
  startBlock: bigint;
  endBlock: bigint;
}
export function activeEpoch(block: bigint, current: Epoch, previous?: Epoch) {
  const active = [current, previous].find((epoch) => epoch && epoch.startBlock <= block && block <= epoch.endBlock);
  return { current: active?.signer, next: current.startBlock > block ? current.signer : undefined };
}

export function watchL2(
  client: PublicClient,
  chainId: number,
  contract: { address: Address; abi: Abi },
  callbacks: {
    block: (block: bigint) => void;
    epoch: (current?: Address, next?: Address) => void;
    error: (error: unknown) => void;
  },
) {
  let disposed = false;
  let unwatch: (() => void) | undefined;
  let lastChecked: bigint | undefined;
  let generation = 0;
  const fail = (error: unknown) => {
    if (!disposed) callbacks.error(error);
  };
  const onBlockNumber = async (block: bigint) => {
    if (disposed) return;
    callbacks.block(block);
    if (lastChecked !== undefined && block >= lastChecked && block - lastChecked <= 30n) return;
    lastChecked = block;
    const request = ++generation;
    try {
      const current = (await client.readContract({ ...contract, functionName: 'currentEpoch' })) as Epoch;
      let previous: Epoch | undefined;
      if (current.number > 0n) {
        const [number, signer, startBlock, endBlock] = (await client.readContract({
          ...contract,
          functionName: 'epochs',
          args: [current.number - 1n],
        })) as [bigint, Address, bigint, bigint];
        previous = { number, signer, startBlock, endBlock };
      }
      if (disposed || request !== generation) return;
      const result = activeEpoch(block, current, previous);
      callbacks.epoch(result.current, result.next);
    } catch (error) {
      if (request === generation) {
        lastChecked = undefined;
        fail(error);
      }
    }
  };
  void client
    .getChainId()
    .then((actual) => {
      if (disposed) return;
      if (actual !== chainId) throw new Error('Unexpected L2 chain');
      unwatch = client.watchBlockNumber({
        emitOnBegin: true,
        poll: true,
        pollingInterval: 60_000,
        onBlockNumber,
        onError: fail,
      });
    })
    .catch(fail);
  return () => {
    disposed = true;
    generation++;
    unwatch?.();
  };
}
