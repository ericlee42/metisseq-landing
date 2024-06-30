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
  inputClassName?: string;
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
    inputClassName,
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

    if (decimal && !max) {
      if (value && verifyValidNumber(value, decimal)) return;
      // const result = new BigNumber(value).decimalPlaces(decimal).toString();
      value;
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
        className={inputClassName}
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
