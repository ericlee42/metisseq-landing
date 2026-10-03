import { IconGlobalSpin } from '@/assets/icons/IconGroup';

const Loading = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => {
  return <IconGlobalSpin size={size} color={color} />;
};
export default Loading;
