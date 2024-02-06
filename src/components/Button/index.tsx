import * as React from 'react';
import classNames from 'classnames';
import { tuple } from '../_type/type';
import { cloneElement } from '../_util/reactNode';
import { IconGlobalSpin } from '@/assets/icons/IconGroup';
import './index.scss';

const ButtonTypes = tuple(
  'primary',
  'solid',
  'second',
  'text',
  'short-solid',
  'long-solid',
  'short',
  'long',
  'dark',
  'light',
  'metis',
  'metis-solid',
);

type ButtonType = (typeof ButtonTypes)[number];

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'prefix' | 'suffix'> {
  className?: string;
  type?: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Button: React.FC<ButtonProps> = React.forwardRef((props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    className,
    type = 'primary',
    loading = false,
    disabled = false,
    prefix,
    suffix,
    children,
    onClick,
    ...rest
  } = props;

  const classes = classNames(className, 'component-button flex flex-row items-center justify-center', {
    [`${type}`]: type,
    loading,
    disabled,
  });

  const loadingColor = React.useMemo(() => {
    switch (type) {
      case 'primary':
      case 'second':
        return '#111111';
      case 'solid':
        return '#fed702';
      default:
        return '#ffffff';
    }
  }, [type]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
  };

  return (
    <button className={classes} ref={ref} onClick={handleClick} {...rest}>
      {prefix}
      {!disabled && loading && <IconGlobalSpin color={loadingColor} />}
      {!loading && <span>{cloneElement(children)}</span>}
      {suffix}
    </button>
  );
});

export default Button;
