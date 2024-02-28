import { ethers } from 'ethers';

export function generateAvatar(address: ethers.utils.BytesLike, size: number) {
  if (!address) return;
  const hash = ethers.utils.keccak256(address);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx: any = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `#${hash.slice(3, 5)}${hash.slice(13, 15)}${hash.slice(23, 25)}`);
  gradient.addColorStop(0.5, `#${hash.slice(5, 7)}${hash.slice(15, 17)}${hash.slice(25, 27)}`);
  gradient.addColorStop(1, `#${hash.slice(7, 9)}${hash.slice(17, 19)}${hash.slice(27, 29)}`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return canvas.toDataURL();
}
