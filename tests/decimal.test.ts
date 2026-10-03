import { describe, expect, it } from 'vitest';
import {
  addDecimals,
  subtractDecimals,
  multiplyDecimals,
  divideDecimals,
  compareDecimals,
  isDecimal,
  toFixedDecimal,
} from '@/utils/decimal';
import { filterPrecision, formatNumber } from '@/utils/tools';

describe('exact decimal amounts', () => {
  it('preserves wei-sized fractions above the safe integer range', () => {
    expect(addDecimals('9007199254740993', '0.000000000000000001')).toBe('9007199254740993.000000000000000001');
    expect(subtractDecimals('9007199254740993.000000000000000001', '9007199254740993')).toBe('0.000000000000000001');
    expect(compareDecimals('9007199254740993', '9007199254740992')).toBe(1);
    expect(multiplyDecimals('1e-8', '20000')).toBe('0.0002');
    expect(divideDecimals('1000000000000000001', '1e18')).toBe('1.000000000000000001');
  });
  it('preserves display rounding and trailing zeros', () => {
    expect(toFixedDecimal('1.99999', 4, 'down')).toBe('1.9999');
    expect(toFixedDecimal('1.00001', 2, 'ceil')).toBe('1.01');
    expect(toFixedDecimal('-1.00001', 2, 'ceil')).toBe('-1.00');
    expect(toFixedDecimal('-1.00001', 2, 'floor')).toBe('-1.01');
    expect(toFixedDecimal('1.005', 2)).toBe('1.01');
    expect(filterPrecision('2', 4)).toBe('2.0000');
    expect(formatNumber('9007199254740993.125')).toBe('9,007,199,254,740,993.13');
  });
  it('calculates APR and rejects invalid amounts', () => {
    expect(
      toFixedDecimal(multiplyDecimals(divideDecimals(divideDecimals('100', '30'), '20000'), 36500), 2, 'ceil'),
    ).toBe('6.09');
    for (const value of ['', '.', 'NaN', 'Infinity', '1e999999', undefined, null]) expect(isDecimal(value)).toBe(false);
    expect(compareDecimals('bad', 0)).toBeNaN();
    expect(divideDecimals(1, 0)).toBe('NaN');
    expect(() => toFixedDecimal(1, -1)).toThrow(RangeError);
  });
});
