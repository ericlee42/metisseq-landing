import useAuth from '@/hooks/useAuth';
import useChainWatcher from '@/hooks/useChainWatcher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { mainnet, sepolia } from 'viem/chains';
import { afterEach, describe, expect, it } from 'vitest';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { connect, disconnect, reconnect, switchChain } from 'wagmi/actions';
import { mock } from 'wagmi/connectors';

afterEach(cleanup);
const address = '0x0000000000000000000000000000000000000001';
function setup(features = {}) {
  const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [mock({ accounts: [address], features })],
    transports: { [mainnet.id]: http(), [sepolia.id]: http() },
    storage: null,
  });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
  return { config, wrapper };
}
describe('wagmi wallet lifecycle', () => {
  it('connects, switches chains, and disconnects through the migrated hooks', async () => {
    const { config, wrapper } = setup();
    const { result } = renderHook(() => ({ auth: useAuth(), watcher: useChainWatcher() }), { wrapper });
    expect(result.current.auth.isConnected).toBe(false);
    await act(() => connect(config, { connector: config.connectors[0], chainId: 1 }));
    await waitFor(() => expect(result.current.auth.address).toBe(address));
    expect(result.current.auth.chainId).toBe(1);
    await act(() => result.current.watcher.setupNetwork(sepolia.id));
    await waitFor(() => expect(result.current.auth.chainId).toBe(sepolia.id));
    await act(() => disconnect(config));
    await waitFor(() => expect(result.current.auth.isDisconnected).toBe(true));
    expect(result.current.auth.address).toBeUndefined();
  });
  it('restores an authorized connection with the new reconnect mechanism', async () => {
    const { config, wrapper } = setup({ defaultConnected: true, reconnect: true });
    const { result } = renderHook(useAuth, { wrapper });
    await act(() => reconnect(config));
    await waitFor(() => expect(result.current.isConnected).toBe(true));
    expect(result.current.address).toBe(address);
  });
  it('keeps disconnected state when connection is rejected', async () => {
    const { config, wrapper } = setup({ connectError: true });
    const { result } = renderHook(useAuth, { wrapper });
    await act(async () => {
      await expect(connect(config, { connector: config.connectors[0] })).rejects.toThrow();
    });
    expect(result.current.isConnected).toBe(false);
  });
  it('preserves the current chain when a switch is rejected', async () => {
    const { config, wrapper } = setup({ switchChainError: true });
    const { result } = renderHook(useAuth, { wrapper });
    await act(() => connect(config, { connector: config.connectors[0], chainId: 1 }));
    await act(async () => {
      await expect(switchChain(config, { chainId: sepolia.id })).rejects.toThrow();
    });
    expect(result.current.chainId).toBe(1);
  });
});
