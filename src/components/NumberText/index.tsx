import { compareDecimals, isDecimal } from '@/utils/decimal';
import { formatNumber } from '@/utils/tools';

const NumberText = ({ value, allowZero }: { value?: string | number | bigint | null; allowZero?: boolean }) => {
  if (value === null || value === undefined) return '-';
  const ifNaN = !isDecimal(value.toString());
  const ifZero = allowZero ? false : compareDecimals(value.toString(), 0) === 0;

  return ifNaN ? '-' : ifZero ? '-' : formatNumber(value.toString());
};

export default NumberText;
