export const verifyDevice = () => {
  return /android|iphone/i.test(window.navigator.userAgent) ? 'mobile' : 'pc';
};
const device = verifyDevice();
const ifMobile = device === 'mobile';
const ifPc = device === 'pc';

const useDevice = () => {
  return {
    device,
    ifMobile,
    ifPc,
  };
};

export default useDevice;
