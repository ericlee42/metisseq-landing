import dayjs, { Dayjs } from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import BigNumber from 'bignumber.js';
import { uniq, uniqBy } from 'lodash-es';
import { Address, mainnet, sepolia } from 'wagmi';
import { ethers } from 'ethers';
import { holesky } from 'viem/chains';
import { VITE_APP_L2_CHAIN_ID, VITE_APP_L2_RPC, VITE_APP_L2_TESTNET_CHAIN_ID, VITE_APP_L2_TESTNET_RPC, l2Provider } from '@/configs/common';

dayjs.extend(UTC);

type FormatType = 'DD/MM/YYYY' | 'DD/MM/YYYY HH:mm:ss' | 'HH:mm:ss' | 'MM/DD' | 'MM/DD HH:mm';

/**
 * UTC time
 * @param value
 * @param format
 * @returns
 */
export const filterTime = (value: string | number | Dayjs, format: FormatType = 'DD/MM/YYYY') => {
  const stamp = typeof value === 'number' ? value : Number(value);
  return dayjs.utc(stamp).local().format(format);
};

/**
 * First letter upper case
 * @param value
 * @returns
 */
export const filterTitleCase = (value: string) => {
  return value.toLowerCase().replace(/^\S/, (s) => s.toUpperCase());
};

/**
 * decimalPlaces[does not retain trailing zeros]
 * @param value
 * @param decimal
 * @returns
 */
export const filterPrecision = (value: string | number | undefined, decimal = 4) => {
  if (!value || BigNumber(value).isNaN()) return '-';
  const result = new BigNumber(value).toFixed(decimal, BigNumber.ROUND_DOWN).toString();
  return result;
};

/**
 * thousands filter
 * @param value
 * @param decimal
 * @returns
 */
export const filterThousands = (value: string | number, decimal = 4) => {
  if (new BigNumber(value).isNaN()) return value;
  const result = new BigNumber(filterPrecision(value, decimal)).toFormat(decimal, BigNumber.ROUND_DOWN);
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
 * max filter
 * @param value
 * @param max
 * @param decimal
 * @returns
 */
export const filterMaxNumber = (value: string, max = '0', decimal = 4) => {
  if (new BigNumber(value).isNaN() || /^[0-9]\d*\.$/.test(value)) return value;
  const result = BigNumber.minimum(value, filterPrecision(max, decimal)).toString();
  return result;
};

/**
 * small decimal display
 * @param value
 * @param decimal
 * @param prefix
 * @returns
 */
export const filterMinimumPrecision = (value: string, decimal = 4, prefix = '<') => {
  if (Number(value) === 0) return '0';
  const minimum = `0.${'1'.padStart(decimal, '0')}`;
  const compare = new BigNumber(value).isGreaterThan(minimum);
  const result = compare ? filterThousands(value, decimal) : `${prefix}${minimum}`;
  return result;
};

/**
 * Short unit -> K M B
 * @param value
 * @param decimal
 * @returns
 */
export const filterAbbreviation = (value: string, decimal = 2) => {
  const compare = new BigNumber(value).isGreaterThan(1e6);
  const million = `${filterThousands(new BigNumber(value).dividedBy(1e6).toString(), decimal)} M`;
  const result = compare ? million : filterThousands(value, decimal);
  return result;
};

/**
 * email
 * @param value
 * @returns
 */
export const verifyEmail = (value: string) => {
  const regexp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/g;
  // const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z]{2,10})$/;
  return !regexp.test(value);
};

/**
 * password
 * @param value
 * @returns
 */
export const verifyPassword = (value: string) => {
  if (value.length < 8) return true;
  if (value.length > 20) return true;
  const regexp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
  // const regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
  return !regexp.test(value);
};

/**
 * IP
 * @param value
 * @returns
 */
export const verifyIP = (value: string) => {
  const regexp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // const regexp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
  return !regexp.test(value);
};

/**
 * repeat elements check
 * @param value
 * @param key
 * @returns
 */
export const verifyRepeat = (value: any[], key?: string) => {
  const temp = value.filter((x) => (key ? x[key] : x));
  const shake = key ? uniqBy(temp, key) : uniq(temp);
  return !(shake.length === temp.length);
};

/**
 * number >= 0 validate
 * @param value
 * @param decimal
 * @returns
 */
export const verifyValidNumber = (value: string, decimal = 4) => {
  const regexp = decimal === 0 ? '(^(0|[1-9]\\d*)$)' : `(^(0|([1-9]\\d*))(\\.\\d{0,${decimal}})?$)`;
  // const regexp = new RegExp(`(^[1-9]\\d*(\\.\\d{0,${decimal}})?$)|(^0(\\.\\d{0,${decimal}})?$)`);
  return !new RegExp(regexp).test(value);
};

/**
 * import image -> Vite
 * @param value
 * @returns
 */
export function getImageUrl(value: string) {
  const result = value.replace('@/', '');
  return new URL(`/src/${result}`, import.meta.url).href;
}

/**
 * UUID(RFC4122) -> https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
 * @returns
 */
export const uuidv4 = () => {
  const UINT36 = '10000000-1000-4000-8000-100000000000';
  // eslint-disable-next-line no-bitwise
  const random = (x: string) => ((Number(x) ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> (Number(x) / 4);
  return UINT36.replace(/[018]/g, (x) => random(x)!.toString(16));
};

/**
 * link
 * @param address
 * @param target
 */
export const jumpLink = (address: string, target: '_self' | '_blank' = '_blank') => {
  window.open(address, target);
};

/**
 * exclude regex
 * @param value
 * @returns
 */
export const filterSearch = (value: string) => {
  return value.replace(/([.?*+^$[\]\\(){}|-])/g, '');
};

/**
 * blob download
 * @param fileName
 * @param content
 * @returns
 */
export const download = (fileName: string, content: Blob) => {
  if (!('download' in window.document.createElement('a'))) {
    throw new Error('Parameter is not a number!');
  }
  const blob = new Blob([content], { type: '' });
  const link = window.document.createElement('a');
  link.download = fileName;
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  window.document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  window.document.body.removeChild(link);
  return null;
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

// warning
export const dangerouslyFormatPriceWithFourDecimals = (_i: number | string) => {
  const _input = _i.toString();
  if (_input.length === 6) {
    return BigNumber(_input).div(100).toString();
  }
  return _i.toString();
};

export const rangeRandom = (min = 0, max = 0) => {
  // const num = Math.random() * (m - n + 1) + n;
  return Math.random() * (max - min) + min;
};

function getRandom(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export const parseRevertReason = (data: string) => {
  if (!data.startsWith('0x')) {
    data = `0x${data}`;
  }

  if (ethers.utils.hexDataLength(data) >= 4) {
    const errorMsgData = data || ethers.utils.hexDataSlice(data, 4);
    try {
      console.log('errorMsgData', errorMsgData);
      const errorMsg = ethers.utils.defaultAbiCoder.decode(['string'], errorMsgData);
      console.log('errorMsg', errorMsg);
      return errorMsg[0];
    } catch (error) {
      console.error('unkown error', error);
    }
    // }
  }

  return null;
};

export function isJSONString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const getExtensive = (res: any, option: { suffix?: any; prefix?: any }) => {
  return !BigNumber(res).isFinite() ? 'Extensive' : (option?.prefix || '') + res + (option?.suffix || '');
};

export function formatNumber(value: string | number, roundingMode = 'round') {
  let num = Number(value);
  if ((typeof value !== 'number' && typeof value !== 'string') || isNaN(num)) {
    return '-';
  }
  let roundedNum;
  if (roundingMode === 'floor') {
    roundedNum = Math.floor(num * 100) / 100;
  } else if (roundingMode === 'ceil') {
    roundedNum = Math.ceil(num * 100) / 100;
  } else {
    roundedNum = Math.round(num * 100) / 100;
  }
  let numStr = roundedNum.toString();
  let parts = numStr.split('.');
  if (!parts[1] || parts[1] === '00' || parseFloat(`0.${parts[1]}`) === 0) {
    return parseInt(roundedNum?.toString(), 10).toLocaleString();
  } else {
    parts[0] = parseInt(parts[0]).toLocaleString();
    return parts.join('.');
  }
}

export function getL2RpcByL1ChainId(chianId) {
  switch (+chianId) {
    case mainnet.id:
      return VITE_APP_L2_RPC;
    case sepolia.id:
      return VITE_APP_L2_TESTNET_RPC;
    case holesky.id:
      return VITE_APP_L2_TESTNET_RPC;
    default:
      return undefined;
  }
};

export function getL2ChainIdByL1ChainId(chianId) {
  switch (+chianId) {
    case mainnet.id:
      return VITE_APP_L2_CHAIN_ID;
    case sepolia.id:
      return VITE_APP_L2_TESTNET_CHAIN_ID;
    case holesky.id:
      return VITE_APP_L2_TESTNET_CHAIN_ID;
    default:
      return undefined;
  }
};
