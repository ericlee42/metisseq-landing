import * as React from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { fadeConfig } from '@/configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { getImageUrl } from '@/utils/tools';
import { isNullOrUndefined } from '../_util/is';
import { cloneElement } from '../_util/reactNode';
import { tuple, RequiredField } from '../_type/type';
import { useClickAway } from 'ahooks';
import { Scrollbar } from '../';
import './index.scss';

const SelectTypes = tuple('primary', 'second');

type SelectType = (typeof SelectTypes)[number];

export interface SelectObjectType {
  label?: React.ReactNode;
  name: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
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
  selectorRef: React.RefObject<HTMLDivElement>;
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
    selectorRef,
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

  const triggerRef = React.useRef<HTMLUListElement>(null);
  const [direction, setDirection] = React.useState<PositionProps>();

  const filterPosition = React.useCallback(() => {
    if (!selectorRef.current || !triggerRef.current) return;
    const { top, left, width, height } = selectorRef.current.getBoundingClientRect();
    const { width: triggerWidth } = triggerRef.current.getBoundingClientRect();
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
    return rectSize;
  }, [selectorRef, triggerRef, type, follow, placement]);

  React.useEffect(() => {
    const result = filterPosition();
    setDirection(result);
  }, [filterPosition]);

  const selectTrigger = React.useMemo(() => {
    if (!selectorRef.current) return;
    return (
      <motion.ul
        className={classes}
        ref={triggerRef}
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
              {/* <img className="check" src={getImageUrl('@/assets/images/_global/icon-select-check.svg')} alt="icon" /> */}
            </li>
          ))}
        </Scrollbar>
      </motion.ul>
    );
  }, [selectorRef, classes, direction, options, value, onChange, onDestroy]);

  useClickAway(() => onDestroy?.(), selectorRef);

  const DOM = (follow && selectorRef.current ? selectorRef.current : window.document.body) as HTMLElement;
  return createPortal(selectTrigger, DOM);
};

const Select: React.FC<SelectProps> = (props: SelectProps) => {
  const {
    className,
    style = {},
    type = 'primary',
    options = [],
    arrow = true,
    danger = false,
    disabled = false,
    placeholder,
    value,
    renderSelector,
    follow = true,
    allowClear = false,
    arrowPlacement = 'left',
    onChange,
    ...rest
  } = props;

  const classes = classNames(className, 'component-select flex items-center justify-end', {
    [`${type}`]: type,
    danger,
    disabled,
    follow,
    'flex-row': arrowPlacement === 'right',
    'flex-row-reverse': arrowPlacement === 'left',
    // selector
  });

  const selectorRef = React.useRef<HTMLDivElement>(null);
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
        ref={selectorRef}
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
                onChange?.('');
              }}
            />
          )}
          <img className="arrow" src={getImageUrl('@/assets/images/_global/ic_down.svg')} alt="icon" />
        </div>
      </div>
      <AnimatePresence>
        {visible && (
          <Portal
            type={type}
            value={value}
            options={options}
            follow={follow}
            selectorRef={selectorRef}
            onDestroy={handleVisible}
            {...props}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Select;
