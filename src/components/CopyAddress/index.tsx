import useAuth from '@/hooks/useAuth';
import { filterHideText, getImageUrl } from '@/utils/tools';
import classNames from 'classnames';
import { styled } from 'styled-components';
import clipboard from 'copy-to-clipboard';
import { message } from '..';

const Container = styled.div`
  span {
    font-size: 14px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #333347;
    line-height: 21px;
  }
  img {
    width: 12px;
    height: 12px;
  }
`;

const CopyAddress = ({
  addr,
  className,
  reverse,
  hide = true,
  copyTrigger,
  dark = true,
}: {
  addr?: string;
  className?: any;
  reverse?: boolean;
  hide?: boolean;
  copyTrigger?: any;
  dark?: boolean;
}) => {
  const { address } = useAuth();

  const copy = () => {
    if (!(addr || address)) return;
    clipboard(addr || (address as any));
    message.success('copied!');
  };

  return (
    <Container
      className="flex flex-row items-center gap-8 pointer"
      style={{
        flexDirection: reverse ? 'row-reverse' : 'row',
      }}
      onClick={copy}
    >
      <span className={`copy-content ${className}`}>
        {addr || address ? (hide ? filterHideText(addr || (address as string), 6, 4) : addr) : '-'}
      </span>

      {copyTrigger || (
        <img
          src={
            dark
              ? getImageUrl('@/assets/images/_global/ic_copy_dark.svg')
              : getImageUrl('@/assets/images/_global/ic_copy.svg')
          }
        />
      )}
    </Container>
  );
};

export default CopyAddress;
