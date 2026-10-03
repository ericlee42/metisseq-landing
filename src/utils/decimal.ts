import { formatUnits } from 'viem';

export type DecimalInput = string | number | bigint | null | undefined;
type Decimal = { units: bigint; scale: number };
type Rounding = 'down' | 'ceil' | 'floor' | 'half-up';

// UI decimal arithmetic only. Contract amounts remain bigint wei. Keeping the
// coefficient as an integer avoids converting token balances to floating point.
function parse(value: DecimalInput): Decimal | undefined {
  if (value === null || value === undefined) return;
  const text = String(value).trim();
  if (text.length > 4096) return;
  const match = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(text);
  if (!match || !(match[2] || match[3])) return;
  const exponent = Number(match[4] || 0);
  if (!Number.isInteger(exponent) || Math.abs(exponent) > 1000) return;
  const fraction = match[3] || '';
  const scale = fraction.length - exponent;
  if (Math.abs(scale) > 1000) return;
  let units = BigInt(`${match[1] === '-' ? '-' : ''}${match[2] || '0'}${fraction}`);
  if (scale < 0) units *= 10n ** BigInt(-scale);
  return { units, scale: Math.max(0, scale) };
}

export function decimalString(value: DecimalInput): string {
  const decimal = parse(value);
  return decimal ? formatUnits(decimal.units, decimal.scale) : 'NaN';
}

export function isDecimal(value: DecimalInput): boolean {
  return parse(value) !== undefined;
}

function align(a: Decimal, b: Decimal) {
  const scale = Math.max(a.scale, b.scale);
  return { left: a.units * 10n ** BigInt(scale - a.scale), right: b.units * 10n ** BigInt(scale - b.scale), scale };
}

export function compareDecimals(a: DecimalInput, b: DecimalInput): number {
  const left = parse(a);
  const right = parse(b);
  if (!left || !right) return Number.NaN;
  const values = align(left, right);
  return values.left < values.right ? -1 : values.left > values.right ? 1 : 0;
}

export function addDecimals(a: DecimalInput, b: DecimalInput): string {
  const left = parse(a);
  const right = parse(b);
  if (!left || !right) return 'NaN';
  const values = align(left, right);
  return formatUnits(values.left + values.right, values.scale);
}

export function subtractDecimals(a: DecimalInput, b: DecimalInput): string {
  const right = parse(b);
  return right ? addDecimals(a, formatUnits(-right.units, right.scale)) : 'NaN';
}

export function multiplyDecimals(a: DecimalInput, b: DecimalInput): string {
  const left = parse(a);
  const right = parse(b);
  return left && right ? formatUnits(left.units * right.units, left.scale + right.scale) : 'NaN';
}

function quotient(numerator: bigint, denominator: bigint, rounding: Rounding): bigint {
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const result = numerator / denominator;
  const remainder = numerator % denominator;
  if (remainder === 0n) return result;
  if (rounding === 'ceil') return numerator > 0n ? result + 1n : result;
  if (rounding === 'floor') return numerator < 0n ? result - 1n : result;
  if (rounding === 'half-up' && (remainder < 0n ? -remainder : remainder) * 2n >= denominator) {
    return result + (numerator < 0n ? -1n : 1n);
  }
  return result;
}

function checkPlaces(places: number) {
  if (!Number.isInteger(places) || places < 0 || places > 1000) throw new RangeError('Invalid decimal places');
}

export function divideDecimals(a: DecimalInput, b: DecimalInput, places = 20, rounding: Rounding = 'half-up'): string {
  checkPlaces(places);
  const left = parse(a);
  const right = parse(b);
  if (!left || !right || right.units === 0n) return 'NaN';
  const units = quotient(
    left.units * 10n ** BigInt(places + right.scale),
    right.units * 10n ** BigInt(left.scale),
    rounding,
  );
  return formatUnits(units, places);
}

export function toFixedDecimal(value: DecimalInput, places: number, rounding: Rounding = 'half-up'): string {
  checkPlaces(places);
  const decimal = parse(value);
  if (!decimal) return 'NaN';
  const units =
    decimal.scale > places
      ? quotient(decimal.units, 10n ** BigInt(decimal.scale - places), rounding)
      : decimal.units * 10n ** BigInt(places - decimal.scale);
  const sign = units < 0n ? '-' : '';
  const digits = (units < 0n ? -units : units).toString().padStart(places + 1, '0');
  return places ? `${sign}${digits.slice(0, -places)}.${digits.slice(-places)}` : `${sign}${digits}`;
}
