import * as React from 'react';
import classNames from 'classnames';
import { LiteralUnion } from '../_type/type';
import './index.scss';
import { getImageUrl, verifyValidNumber, filterMaxNumber, filterPrecision } from '@/utils/tools';
import { useBoolean } from 'ahooks';
import BigNumber from 'bignumber.js';

/* eslint-disable */
type inputType = LiteralUnion<
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week',
  string
>;
/* eslint-enable */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  className?: string;
  type?: inputType;
  danger?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  solid?: boolean;
  solidLight?: boolean;
  max?: string;
  decimal?: number;
  onChange?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
  onClear?: (...args: any[]) => any;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = React.forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    className,
    type = 'text',
    danger = false,
    disabled = false,
    solid = false,
    solidLight = false,
    prefix,
    suffix,
    // clear = false,
    max,
    decimal,
    value,
    onChange,
    onFocus,
    onBlur,
    onClear,
    onPressEnter,
    ...rest
  } = props;

  const uuid = React.useId();

  React.useEffect(() => {
    if (max && BigNumber(value?.toString() || 0).gt(max)) {
      onChange?.(max, null);
    }
  }, [max, value]);
  const classes = classNames(className, 'component-input flex flex-row items-center justify-between', {
    danger,
    disabled,
    solid,
    solidLight,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (value === '.') {
      onChange?.('', e.target.name);
      return;
    }

    // if (value.toString() === '0.0' || value.toString() === '0.00') {
    //   onChange?.(value, e.target.name);
    //   return;
    // }

    // const ifInvalid = value.endsWith('.');

    // if (ifInvalid) {
    //   onChange?.(value, e.target.name);
    //   return value;
    // }
    // console.log('ifInvalid', ifInvalid);

    // let v: any = value;

    // if (decimal !== undefined) {
    //   console.log('v', v);

    //   const regex = new RegExp(`([0-9]+(\\.[0-9]{0,${decimal}})?)(.*)`);

    //   const match = v.match(regex);
    //   if (match) {
    //     v = match[1];
    //   }
    //   // onChange?.(v, e.target.name);
    //   // return v;
    // }

    // console.log('v1', v);

    // const ifMin = !BigNumber(min || '').isNaN();
    // const ifMax = !BigNumber(max || '').isNaN();

    // if (ifMin && value) {
    //   v = BigNumber.max(v, min?.toString() || '').toString();
    // }

    // console.log('v2', v, max, min);

    // if (ifMax && value) {
    //   v = BigNumber.min(v.toString(), max?.toString() || '').toString();
    // }

    // console.log('v3', v, max, min, BigNumber('0.0').toString());
    // .replace(/[^\d.]/g, "") //将非数字和点以外的字符替换成空
    // .replace(/^\./g, "") //验证第一个字符是数字而不是点
    // .replace(/\.{2,}/g, ".") //出现多个点时只保留第一个
    // .replace(".", "$#$") // 1、将数字的点替换成复杂字符$#$
    // .replace(/\./g, "") // 2、将字符串的点直接清掉
    // .replace("$#$", ".") // 3、将复杂字符再转换回点
    // .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数

    // if (v) {
    //   onChange?.(v, e.target.name);
    //   return;
    // }

    // if (decimal !== undefined && v) {
    //   onChange?.(BigNumber(v).toFixed(decimal, BigNumber.ROUND_DOWN), e.target.name);
    //   return;
    // }
    // onChange?.(value, e.target.name);
    if (decimal && !max) {
      if (value && verifyValidNumber(value, decimal)) return;
      // const result = new BigNumber(value).decimalPlaces(decimal).toString();
      console.log(value);
      onChange?.(value, name);
      return;
    }
    if (max) {
      if (value && verifyValidNumber(value, decimal)) return;
      const result = `${Math.min(Number(value), Number(filterPrecision(max, decimal)))}`;
      onChange?.(result === max ? max : value, name);
      return;
    }
    onChange?.(value, name);
  };

  const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFocus?.(e.target.value, e.target.name);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBlur?.(e.target.value, e.target.name);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    onPressEnter?.(e);
  };

  const handleClear = () => {
    onClear?.() ?? onChange?.('', 'clear');
  };

  // type === password
  const [hide, { toggle }] = useBoolean(true);

  const displayType = React.useMemo(() => {
    if (type === 'password') {
      return hide ? 'password' : 'text';
    }

    return type;
  }, [hide, type]);

  return (
    <div className={classes}>
      {prefix}
      <input
        autoComplete="off"
        ref={ref}
        type={displayType}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyUp={handleEnter}
        {...rest}
      />
      <label htmlFor={uuid} />
      {/* {!disabled && clear && value && <img className="clear" alt="icon" onClick={handleClear} />} */}
      {suffix}
      {type === 'password' && (
        <img onClick={toggle} src={getImageUrl(`@/assets/images/profile/icon-eye-${hide ? 'hide' : 'open'}.svg`)} />
      )}
    </div>
  );
});

export default Input;
