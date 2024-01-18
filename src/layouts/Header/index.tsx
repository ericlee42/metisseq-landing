/* eslint-disable max-len */
import WalletModal from '@/components/WalletModal';
import { isDev } from '@/configs/common';
import useDevice from '@/hooks/useDevice';
import useWatchAsset from '@/hooks/useWatchAsset';
import { getImageUrl, jumpLink } from '@/utils/tools';
import { styled } from 'styled-components';
import Hamburger from 'hamburger-react';
import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';

const Container = styled.div`
  padding: 22px 32px;

  .hover-color-00D2FF {
    transition: all linear 0.1s;
  }
  .hover-color-00D2FF:hover {
    color: #00d2ff !important;
  }

  .bm-menu-wrap {
    top: 0;
    width: 100vw !important;
    left: 0;
    padding: 22px 32px;
  }

  .bm-item {
    display: flex !important;
    flex-direction: column;
  }

  .bm-overlay {
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 1) !important;
  }
  .hamburger-react {
    align-self: flex-end;
  }
  #react-burger-menu-btn {
    z-index: -1!important;
  }
  .opened {
    #react-burger-menu-btn {
      z-index: 1!important;
    }
  }
`;

const headerNav = [
  {
    label: 'Developer',
    link: 'https://www.metis.io/platform',
  },
  {
    label: 'Ecosystem',
    link: 'https://www.metis.io/ecosystem',
  },
  {
    label: 'Governance',
    link: 'https://www.metis.io/ceg',
  },
  {
    label: 'Company',
    link: 'https://www.metis.io/company',
  },
  {
    label: 'Bridge',
    link: 'https://www.metis.io/bridge',
  },
  {
    label: 'Knolewdge',
    link: 'https://www.metis.io/knowledge',
  },
];

const Header = () => {
  const { watchMetis } = useWatchAsset();
  const { ifMobile } = useDevice();

  const handleJumpLink = (link: string) => {
    if (!link) return;
    jumpLink(link);
  };

  const [isOpen, setOpen] = useState(false);

  return (
    <Container className="flex flex-row items-center justify-between w-full">
      <span>
        <img
          className="pointer"
          onClick={() => {
            jumpLink('https://www.metis.io/', '_blank');
          }}
          src={getImageUrl('@/assets/images/_global/metis_logo_dark.svg')}
        />
      </span>

      {ifMobile ? (
        <div className={`${isOpen ? 'opened' : ''} w-full flex flex-row justify-end`}>
          <Menu
            right
            width={'100%'}
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            customBurgerIcon={<Hamburger color="#00D2FF" toggled={isOpen} toggle={setOpen} />}
          >
            <div className="w-full">
              <Hamburger color="#00D2FF" toggled={isOpen} toggle={setOpen} />
              <div className="flex flex-col items-start gap-20 p-12">
                {headerNav.map((i) => (
                  <div
                    className="raleway pointer fz-20 fw-500 color-000 hover-color-00D2FF"
                    onClick={() => handleJumpLink(i?.link)}
                    key={i.label}
                  >
                    {i.label}
                  </div>
                ))}
              </div>

              <div className='w-full pt-60'>
              <WalletModal />
              </div>
            </div>
          </Menu>
        </div>
      ) : (
        <div className="flex flex-row gap-20 items-center">
          {isDev ? <div onClick={watchMetis}>Add Metis</div> : null}
          <div className="flex flex-row items-center gap-20">
            {headerNav.map((i) => (
              <div
                className="raleway pointer fz-15 fw-500 color-000 hover-color-00D2FF"
                onClick={() => handleJumpLink(i?.link)}
                key={i.label}
              >
                {i.label}
              </div>
            ))}
          </div>
          {/* <img className="pointer" src={getImageUrl('@/assets/images/_global/dark_theme.svg')} /> */}

          <WalletModal />
        </div>
      )}
    </Container>
  );
};

export default Header;
