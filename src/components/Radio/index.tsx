import * as React from 'react';
import classNames from 'classnames';
import { cloneElement } from '../_util/reactNode';

type SizeType = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'checked'> {
  className?: string;
  size?: SizeType;
  disabled?: boolean;
  value: string | number;
  checked?: string | number;
  children?: React.ReactNode;
  onChange?: (...args: any[]) => any;
}

const IconCircle: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" {...props}>
      <circle cx="5" cy="5" r="5" fill="#00BA3D" />
    </svg>
  );
};

const Radio: React.FC<RadioProps> = React.forwardRef((props: RadioProps, ref: React.Ref<HTMLInputElement>) => {
  const { className, size = 'md', disabled = false, value, checked, children, onChange } = props;

  const uuid = React.useId();

  const visible = React.useMemo(() => String(checked) === String(value), [checked, value]);

  const classes = classNames(className, {
    [`${size}`]: size,
    checked: visible,
    disabled,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const final = typeof value === 'number' ? Number(e.target.value) : e.target.value;
    onChange?.(final, 'radio');
  };

  const memoElement = React.useMemo(() => {
    if (!React.isValidElement(children)) return <span>{children}</span>;
    const renderClone = cloneElement(children, {
      className: `content ${children.props.className ?? ''}`.trimEnd(),
    });
    return renderClone;
  }, [children]);

  return (
    <div className={classes}>
      <input
        type="radio"
        name="group"
        id={uuid}
        ref={ref}
        disabled={disabled}
        value={value}
        checked={visible}
        onChange={handleChange}
      />
      <label htmlFor={uuid}>
        {/* <div className="choose">
          <IconCircle />
        </div> */}
        {memoElement}
      </label>
    </div>
  );
});

export default Radio;
