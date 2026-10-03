import { fadeConfig } from '@/configs/motion';
import { getImageUrl } from '@/utils/tools';
import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Scrollbar } from '../';
import { RequiredField, tuple } from '../_type/type';
import { isNullOrUndefined } from '../_util/is';
import { cloneElement } from '../_util/reactNode';
import './index.css';

const SelectTypes = tuple('primary', 'second');

type SelectType = (typeof SelectTypes)[number];

interface SelectObjectType {
  label?: React.ReactNode;
  name: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps {
  className?: string;
  triggerClassName?: string;
  type?: SelectType;
  value?: SelectObjectType['value'];
  options?: SelectObjectType[];
  arrow?: boolean;
  danger?: boolean;
  disabled?: boolean;
  placeholder?: any;
  allowClear?: boolean;
  placement?: 'left' | 'right';
  arrowPlacement?: 'left' | 'right';
  style?: any;
  /**
   * @defaultValue false
   */
  follow?: boolean;
  /**
   * @defaultValue none
   */
  renderSelector?: React.ReactNode;
  onChange?: (args: SelectObjectType) => any;
}

interface TriggerProps extends RequiredField<SelectProps, 'options'> {
  selectorElement: HTMLDivElement;
  onDestroy: (...args: any[]) => any;
}

interface PositionProps {
  top: number;
  left?: number;
  right?: number;
  width?: number;
}

const Portal: React.FC<TriggerProps> = (props: TriggerProps) => {
  const {
    selectorElement,
    triggerClassName,
    type,
    value,
    options,
    follow,
    placement = 'left',
    onChange,
    onDestroy,
  } = props;

  const classes = classNames(triggerClassName, 'global-select', { [`${type}`]: type });

  const [direction, setDirection] = React.useState<PositionProps>();

  const measureTrigger = React.useCallback(
    (trigger: HTMLUListElement | null) => {
      if (!trigger) return;
      const { top, left, width, height } = selectorElement.getBoundingClientRect();
      const { width: triggerWidth } = trigger.getBoundingClientRect();
      const siteMap = {
        left: left,
        right: left - triggerWidth + width,
      };
      const rectSize: PositionProps = {
        top: (follow ? 0 : top) + height,
      };
      if (type === 'primary' && !follow) {
        rectSize.left = siteMap[placement];
      }
      if (type === 'primary' && follow) {
        rectSize[placement] = 0;
      }
      if (type === 'second') {
        rectSize.left = follow ? 0 : left;
        rectSize.width = width;
      }
      setDirection(rectSize);
    },
    [selectorElement, type, follow, placement],
  );

  const selectTrigger = React.useMemo(() => {
    return (
      <motion.ul
        className={classes}
        ref={measureTrigger}
        style={direction}
        onClick={(e) => e.stopPropagation()}
        {...fadeConfig}
      >
        <Scrollbar>
          {options.map((ele) => (
            <li
              className={classNames('flex flex-row items-center justify-between', {
                active: value === ele.value,
                default: value !== ele.value,
                'disabled-filter': ele?.disabled,
              })}
              key={ele.value}
              onClick={() => {
                if (ele?.disabled) return;
                onChange?.(ele);
                onDestroy();
              }}
            >
              {ele?.label || ele.name}
            </li>
          ))}
        </Scrollbar>
      </motion.ul>
    );
  }, [classes, direction, options, value, onChange, onDestroy, measureTrigger]);

  useClickAway(
    () => onDestroy?.(),
    () => selectorElement,
  );

  const DOM = (follow && selectorElement ? selectorElement : window.document.body) as HTMLElement;
  return createPortal(selectTrigger, DOM);
};

const Select: React.FC<SelectProps> = (props: SelectProps) => {
  const {
    className,
    style = {},
    type = 'primary',
    options = [],
    danger = false,
    disabled = false,
    placeholder,
    value,
    renderSelector,
    follow = true,
    allowClear = false,
    arrowPlacement = 'left',
    onChange,
  } = props;

  const classes = classNames(className, 'component-select flex items-center justify-end', {
    [`${type}`]: type,
    danger,
    disabled,
    follow,
    'flex-row': arrowPlacement === 'right',
    'flex-row-reverse': arrowPlacement === 'left',
  });

  const [selectorElement, setSelectorElement] = React.useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState<boolean>(false);

  const handleVisible: React.MouseEventHandler<HTMLDivElement> = () => {
    if (danger || disabled) return;
    setVisible((v) => !v);
  };

  const filterLabel = React.useMemo(() => {
    const result = options.find((ele) => ele.value === value);
    return result?.label || result?.name || value;
  }, [value, options]);

  return (
    <React.Fragment>
      <div
        style={style}
        className={`gap-8 ${classes} ${visible ? 'open' : ''} ${
          allowClear && value ? 'select-allow-clear' : ''
        }`.trimEnd()}
        ref={setSelectorElement}
        onClick={handleVisible}
      >
        {renderSelector ? cloneElement(renderSelector) : filterLabel}
        {isNullOrUndefined(value) && <span className="placeholder">{placeholder}</span>}
        <div className={'flex flex-row items-center justify-end '}>
          {allowClear && value && (
            <img
              className="colse"
              src={getImageUrl('@/assets/images/_global/icon-select_close.svg')}
              alt="icon"
              onClick={() => {
                onChange?.({ value: '', label: '', name: '' });
              }}
            />
          )}
          <img className="arrow" src={getImageUrl('@/assets/images/_global/ic_down.svg')} alt="icon" />
        </div>
      </div>
      <AnimatePresence>
        {visible && selectorElement && (
          <Portal
            type={type}
            value={value}
            options={options}
            follow={follow}
            selectorElement={selectorElement}
            onDestroy={handleVisible}
            {...props}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Select;
