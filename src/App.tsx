// import * as React from 'react';
import Router from '@/routes';
import { RecoilRoot } from 'recoil';
import { config, WagmiProvider } from '@/configs/wallet';
// import { GlobalScrollbar } from 'mac-scrollbar';
// import 'mac-scrollbar/dist/mac-scrollbar.css';
import '@/assets/styles/index.scss';
import useDevice from './hooks/useDevice';

function App() {
  const { ifMobile } = useDevice();
  return (
    <div
      className="_root"
      style={{
        minWidth: ifMobile ? '100vw' : '1280px',
      }}
    >
      <RecoilRoot>
        <WagmiProvider config={config}>
          <Router />
        </WagmiProvider>
      </RecoilRoot>
      {/* <GlobalScrollbar
        skin="dark"
        thumbStyle={() => ({ width: 4, background: 'rgba(255, 255, 255, 0.12)', borderRadius: 6 })}
        trackStyle={() => ({ right: 1, width: 0, border: 0 })}
        trackGap={[4, 4, 4, 4]}
        suppressAutoHide
      /> */}
    </div>
  );
}

export default App;
