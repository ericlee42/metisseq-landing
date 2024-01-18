import dayjs, { Dayjs } from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import BigNumber from 'bignumber.js';
import { uniq, uniqBy } from 'lodash-es';
import { Address } from 'wagmi';
import { ethers } from 'ethers';

dayjs.extend(UTC);

type FormatType = 'DD/MM/YYYY' | 'DD/MM/YYYY HH:mm:ss' | 'HH:mm:ss' | 'MM/DD' | 'MM/DD HH:mm';

/**
 * UTC时间格式化
 * @param value
 * @param format
 * @returns
 */
export const filterTime = (value: string | number | Dayjs, format: FormatType = 'DD/MM/YYYY') => {
  const stamp = typeof value === 'number' ? value : Number(value);
  return dayjs.utc(stamp).local().format(format);
};

/**
 * 首字母大写
 * @param value
 * @returns
 */
export const filterTitleCase = (value: string) => {
  return value.toLowerCase().replace(/^\S/, (s) => s.toUpperCase());
};

/**
 * 数字精度 -> decimalPlaces[does not retain trailing zeros]
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
 * 数字千位分割
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
 * 隐藏文本信息
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
 * 最大值过滤
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
 * 最小精度显示优化
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
 * 大数缩写 -> K M B
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
 * 邮箱校验
 * @param value
 * @returns
 */
export const verifyEmail = (value: string) => {
  const regexp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/g;
  // const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z]{2,10})$/;
  return !regexp.test(value);
};

/**
 * 密码校验
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
 * IP校验
 * @param value
 * @returns
 */
export const verifyIP = (value: string) => {
  const regexp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // const regexp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
  return !regexp.test(value);
};

/**
 * 数组元素重复校验
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
 * 非负数校验
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
 * 导入图片资源 -> Vite
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
 * 外链跳转
 * @param address
 * @param target
 */
export const jumpLink = (address: string, target: '_self' | '_blank' = '_blank') => {
  window.open(address, target);
};

/**
 * 搜索时排除正则符号
 * @param value
 * @returns
 */
export const filterSearch = (value: string) => {
  return value.replace(/([.?*+^$[\]\\(){}|-])/g, '');
};

/**
 * blob下载
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
// 判断当前输入值 如果为6位则除100，4位则直接返回，当ETH价格超过9999时失效
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
  // 检查 data 是否以 "0x" 开头，如果不是，添加 "0x"
  if (!data.startsWith('0x')) {
    data = `0x${data}`;
  }

  // 检查 data 是否表示一个有效的错误信息
  if (ethers.utils.hexDataLength(data) >= 4) {
    // 获取错误信息的 "selector" 部分
    // const selector = ethers.utils.hexDataSlice(data, 0, 4);
    // 以太坊 EIP-838 定义了 "Error(string)" 函数的 selector 为 "0x08c379a0"
    // if (selector === '0x08c379a0') {
    // 获取错误信息的 "data" 部分
    const errorMsgData = data || ethers.utils.hexDataSlice(data, 4);
    try {
      console.log('errorMsgData', errorMsgData);
      // 尝试解析错误信息
      const errorMsg = ethers.utils.defaultAbiCoder.decode(['string'], errorMsgData);
      console.log('errorMsg', errorMsg);
      return errorMsg[0];
    } catch (error) {
      console.error('无法解析错误信息', error);
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
  // 尝试将输入转换为数字
  let num = Number(value);

  // 检查转换后的值是否为有效数字
  if (typeof value !== 'number' && typeof value !== 'string' || isNaN(num)) {
    return '-';
  }

  // 根据提供的取整模式执行对应的取整操作
  let roundedNum;
  if (roundingMode === 'floor') {
    roundedNum = Math.floor(num * 100) / 100;
  } else if (roundingMode === 'ceil') {
    roundedNum = Math.ceil(num * 100) / 100;
  } else {
    // 默认使用四舍五入
    roundedNum = Math.round(num * 100) / 100;
  }

  // 转换为字符串
  let numStr = roundedNum.toString();

  // 分割整数和小数部分
  let parts = numStr.split('.');

  // 如果不存在小数部分或者小数部分为0，则返回格式化的整数
  if (!parts[1] || parts[1] === '00' || parseFloat(`0.${parts[1]}`) === 0) {
    return parseInt(roundedNum?.toString(), 10).toLocaleString();
  } else {
    // 存在小数部分，保留两位小数
    parts[0] = parseInt(parts[0]).toLocaleString();
    return parts.join('.');
  }
}