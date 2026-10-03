import { parseEther } from 'viem';

// viem rounds excess decimal places; transaction inputs must instead retain the
// previous exact conversion contract and reject a fractional wei.
export function parseTokenAmount(value: string): bigint {
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) throw new Error('Invalid amount');
  const fraction = value.split('.')[1] || '';
  if (/[1-9]/.test(fraction.slice(18))) throw new Error('Amount exceeds 18 decimals');
  return parseEther(value);
}
