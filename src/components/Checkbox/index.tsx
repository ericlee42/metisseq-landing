import * as React from 'react';
import classNames from 'classnames';
import { cloneElement } from '../_util/reactNode';
import './index.scss';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  children?: React.ReactNode;
  onChange?: (...args: any[]) => any;
}

const Checkbox: React.FC<CheckboxProps> = React.forwardRef((props: CheckboxProps, ref: React.Ref<HTMLInputElement>) => {
  const { className, disabled = false, checked = false, children, onChange } = props;

  const uuid = React.useId();

  const classes = classNames(className, 'component-checkbox', {
    checked,
    disabled,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked, 'checkbox');
  };

  const memoElement = React.useMemo(() => {
    if (!React.isValidElement(children)) return <span className="content">{children}</span>;
    const renderContent = cloneElement(children, {
      className: `content ${children.props.className ?? ''}`.trimEnd(),
    });
    return renderContent;
  }, [children]);

  return (
    <div className={classes}>
      <input type="checkbox" id={uuid} ref={ref} disabled={disabled} checked={checked} onChange={handleChange} />
      <label className="flex flex-row items-center justify-start" htmlFor={uuid}>
        <div className="choose flex flex-row items-center justify-center">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4.5L4.33333 8L11 1" stroke="black" strokeWidth="2" />
          </svg>
        </div>
        {memoElement}
      </label>
    </div>
  );
});

export default Checkbox;
