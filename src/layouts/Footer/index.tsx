import IconDiscord from '@/components/Icons/IconDiscord';
import IconGithub from '@/components/Icons/IconGithub';
import IconIns from '@/components/Icons/IconIns';
import IconMedium from '@/components/Icons/IconMedium';
import IconTelegram from '@/components/Icons/IconTelegram';
import IconTwitter from '@/components/Icons/IconTwitter';
import IconYoutube from '@/components/Icons/IconYoutube';
import useDevice from '@/hooks/useDevice';

import { getImageUrl, jumpLink } from '@/utils/tools';
import { styled } from 'styled-components';

const links = [
  {
    content: 'Platform',
    link: 'https://www.metis.io/platform',
  },
  {
    content: 'Knowledge',
    link: 'https://www.metis.io/knowledge',
  },
  {
    content: 'Carrers',
    link: 'https://www.metis.io/jobs',
  },
  {
    content: 'Subscribe',
    link: 'https://www.metis.io/newsletter',
  },
  {
    content: 'Q&A',
    link: 'https://www.metis.io/knowledge',
  },
  {
    content: 'Brand Assets',
    link: 'https://www.metis.io/brandassets',
  },
];

const link2 = [
  {
    content: 'Community',
    link: 'https://www.metis.io/community',
  },
  {
    content: 'Company',
    link: 'https://www.metis.io/company',
  },
  {
    content: 'Ecosystem',
    link: 'https://www.metis.io/ecosystem',
  },
  {
    content: 'Terms & conditions',
    link: 'https://drive.google.com/file/d/1wnNbisUREP_gSX1Vfl1Fjmi9PpObmZZQ/view',
  },
  {
    content: 'Contact',
    link: 'https://www.metis.io/contact-us',
  },
];

const medias = [
  {
    content: <IconTwitter />,
    img: getImageUrl('@/assets/images/_media/twi.svg'),
    link: 'https://twitter.com/MetisDAO',
  },
  {
    content: <IconTelegram />,
    img: getImageUrl('@/assets/images/_media/telegram.svg'),
    link: 'https://t.me/MetisDAO',
  },
  {
    content: <IconMedium />,
    img: getImageUrl('@/assets/images/_media/medium.svg'),
    link: 'https://metisdao.medium.com/',
  },
  {
    content: <IconDiscord />,
    img: getImageUrl('@/assets/images/_media/discord.svg'),
    link: 'https://discord.com/invite/RqfEJZXnxd',
  },
  {
    content: <IconGithub />,
    img: getImageUrl('@/assets/images/_media/github.svg'),
    link: 'https://github.com/MetisProtocol',
  },
  {
    content: <IconYoutube />,
    img: getImageUrl('@/assets/images/_media/you.svg'),
    link: 'https://www.youtube.com/@MetisDAO',
  },
  {
    content: <IconIns />,
    img: getImageUrl('@/assets/images/_media/ins.svg'),
    link: 'https://www.instagram.com/metisdao',
  },
];

const Container = styled.div`
  padding: 52px 200px 156px;
  gap: 80px;

  .hover-color {
    transition: all linear 0.1s;
  }
  .hover-color:hover {
    filter: opacity(0.7);
  }

  .l {
    img {
      width: 207px;
    }
  }

  .links {
    div {
      cursor: pointer;
      /* width: calc(25% - 26px); */
      font-size: 16px;
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      color: #313146;
      line-height: 25px;
    }
    display: flex;
    /* flex-wrap: wrap; */
    /* gap: 26px; */
  }

  .r {
    display: flex;
    align-items: flex-start;

    gap: 8px;
    svg {
      width: 38px;
      height: 38px;
      cursor: pointer;
    }
  }
`;

const Footer = () => {
  const { ifMobile } = useDevice();
  return (
    <Container
      className={`bg-color-000 flex ${
        ifMobile ? 'pt-48 pb-141 pl-22 pr-22 flex-col gap-40' : 'flex-row justify-between'
      }`}
    >
      <div className="l flex flex-col gap-45">
        <img
          className="pointer"
          onClick={() => {
            jumpLink('https://www.metis.io/', '_blank');
          }}
          src={getImageUrl('@/assets/images/_global/metis_logo_light.svg')}
        />

        <div className="links flex flex-row items-start gap-120 justify-between">
          <div className="flex flex-col gap-12">
            {links.map((i, index) => (
              <div
                className="fz-14 fw-400 color-fff pointer hover-color"
                key={index}
                onClick={() => {
                  jumpLink(i.link, '_blank');
                }}
              >
                {i.content}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-12">
            {link2.map((i, index) => (
              <div
                className="fz-14 fw-400 color-fff pointer hover-color"
                key={index}
                onClick={() => {
                  jumpLink(i.link, '_blank');
                }}
              >
                {i.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="r flex-wrap">
        {medias.map((i, index) => (
          <div
            key={index}
            className="pointer hover-color"
            onClick={() => {
              jumpLink(i.link, '_blank');
            }}
          >
            <img className={`${ifMobile ? 's-40' : 's-50'}`} src={i.img} />
          </div>
        ))}
      </div>
    </Container>
  );
};
export default Footer;
