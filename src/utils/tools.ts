import { isDecimal, toFixedDecimal } from '@/utils/decimal';
import {
  VITE_APP_L2_CHAIN_ID,
  VITE_APP_L2_RPC,
  VITE_APP_SEPOLIA_L2_CHAIN_ID,
  VITE_APP_SEPOLIA_L2_RPC,
} from '@/configs/common';
import { Address, decodeErrorResult, type Hex } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

/**
 * decimalPlaces[does not retain trailing zeros]
 * @param value
 * @param decimal
 * @returns
 */
export const filterPrecision = (value: string | number | undefined, decimal = 4) => {
  if (!value || !isDecimal(value)) return '-';
  const result = toFixedDecimal(value, decimal, 'down');
  return result;
};

/**
 * hide text
 * @param value
 * @param before
 * @param after
 * @param fuzz
 * @returns
 */
export const filterHideText = (value: string | Address, before = 4, after = 4, fuzz = '....') => {
  if (!value || value.length <= before + after) return value;
  return `${value.slice(0, before)}${fuzz}${value.slice(-after)}`;
};

/**
 * number >= 0 validate
 * @param value
 * @param decimal
 * @returns
 */
export const verifyValidNumber = (value: string, decimal = 4) => {
  const regexp = decimal === 0 ? '(^(0|[1-9]\\d*)$)' : `(^(0|([1-9]\\d*))(\\.\\d{0,${decimal}})?$)`;
  return !new RegExp(regexp).test(value);
};

// Recursively register images so Vite resolves nested paths in dev and emits build assets.
const imageUrls = import.meta.glob<string>('/src/assets/images/**/*.{svg,png,jpg,jpeg,gif,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function getImageUrl(value: string) {
  const path = `/src/${value.replace(/^@\//, '')}`;
  const url = imageUrls[path];
  if (!url) throw new Error(`Unknown image: ${value}`);
  return url;
}

/**
 * link
 * @param address
 * @param target
 */
export const jumpLink = (address: string, target: '_self' | '_blank' = '_blank') => {
  window.open(address, target);
};

export const catchError = (e: any) => {
  let message = 'unknown error';
  if (e?.shortMessage) {
    message = e?.shortMessage;
  } else if (e?.details) {
    message = e?.details;
  } else if (e?.reason) {
    message = e?.reason;
  } else if (e?.message) {
    const reg = /reason="([^"]*)",/;
    const matches = e?.message.match(reg);

    const errMsg = matches?.length ? matches[1] : e?.message;
    message = errMsg;
  }

  if (message === 'insufficient funds for intrinsic transaction cost') {
    message = 'Insufficient gas for 1ClickTrade';
  }
  return message;
};

export const parseRevertReason = (data: string) => {
  try {
    const decoded = decodeErrorResult({ data: (data.startsWith('0x') ? data : `0x${data}`) as Hex });
    return decoded.errorName === 'Error' ? String(decoded.args?.[0]) : null;
  } catch {
    return null;
  }
};

export function formatNumber(value: string | number, roundingMode = 'round') {
  if (!isDecimal(value)) return '-';
  const mode = roundingMode === 'floor' || roundingMode === 'ceil' ? roundingMode : 'half-up';
  const [integer, fraction] = toFixedDecimal(value, 2, mode).split('.');
  const digits = fraction.replace(/0+$/, '');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return digits ? `${grouped}.${digits}` : grouped;
}

export function getL2RpcByL1ChainId(chianId) {
  switch (+chianId) {
    case mainnet.id:
      return VITE_APP_L2_RPC;
    case sepolia.id:
      return VITE_APP_SEPOLIA_L2_RPC;
    default:
      return undefined;
  }
}

export function getL2ChainIdByL1ChainId(chianId) {
  switch (+chianId) {
    case mainnet.id:
      return VITE_APP_L2_CHAIN_ID;
    case sepolia.id:
      return VITE_APP_SEPOLIA_L2_CHAIN_ID;
    default:
      return undefined;
  }
}
