import useWatchAsset from '@/hooks/useWatchAsset';
import { jumpLink } from '@/utils/tools';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

const Container = styled.div`
  background: #fdfdfd;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.05) inset;
  padding: 22px 32px;

  .active {
    color: #00d2ff !important;
  }

  .hover-color-00D2FF {
    transition: all linear 0.1s;
  }
  .hover-color-00D2FF:hover {
    color: #00d2ff !important;
  }
`;

const leftNav = [
  {
    label: 'Overview',
    link: '/#sequencer',
  },
  {
    label: 'All Sequencers',
    link: '/sequencers#sequencer',
  },
];
const rightNav = [
  {
    label: 'Metis Explorer',
    link: 'https://explorer.metis.io/',
  },
  {
    label: 'Support',
    link: 'mailto:sequencer@metis.io',
  },
];

const Header = () => {
  const { pathname } = useLocation();
  const { watchMetis } = useWatchAsset();

  const navigate = useNavigate();
  const handleJumpLink = (link: string) => {
    if (!link) return;
    jumpLink(link);
  };

  return (
    <Container className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-300 items-center maxw-1440 m-auto justify-between w-full">
        <div className="flex flex-row items-center gap-30">
          {leftNav.map((i) => (
            <div
              key={i.label}
              onClick={() => navigate(i.link)}
              className={`${
                i.link && pathname === i.link ? 'active' : ''
              } hover-color-00D2FF pointer raleway fz-15 color-000 fw-500`}
            >
              {i.label}
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center gap-20">
          {rightNav.map((i) => (
            <div
              key={i.label}
              onClick={() => {
                jumpLink(i.link, '_blank');
              }}
              className="hover-color-00D2FF pointer raleway fz-15 color-000 fw-500"
            >
              {i.label}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Header;
