import '@/assets/styles/index.css';
import { config, WagmiProvider } from '@/configs/wallet';
import Router from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import useDevice from './hooks/useDevice';

const queryClient = new QueryClient();

function App() {
  const { ifMobile } = useDevice();
  return (
    <div
      className="_root"
      style={{
        minWidth: ifMobile ? '100vw' : '1280px',
      }}
    >
      <Provider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </div>
  );
}

export default App;
