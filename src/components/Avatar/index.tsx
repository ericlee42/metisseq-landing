import { getImageUrl } from '@/utils/tools';
import { useState } from 'react';

const Avatar = ({ src, className }: { src?: string; className?: string }) => {
  const [validSrc, setValidSrc] = useState(src);

  const handleError = () => {
    setValidSrc(getImageUrl('@/assets/images/sequencer/avatar.svg'));
  };
  return <img crossOrigin="anonymous" onError={handleError} src={validSrc} className={className} />;
};

export default Avatar;
