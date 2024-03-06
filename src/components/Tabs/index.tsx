import * as React from 'react';
import classNames from 'classnames';
import { tuple } from '../_type/type';
import './index.scss';

const SelectTypes = tuple('primary', 'second');

type SelectType = (typeof SelectTypes)[number];

interface TabsObjectType {
  name: React.ReactNode;
  value: string | number;
  icon?: any;
  disabled?: boolean;
}

export interface TabsProps {
  className?: string;
  type?: SelectType;
  activeIndex?: number;
  items?: TabsObjectType[];
  onChange?: (...args: any[]) => any;
  underlined?: boolean;
}

type PositionProps = Array<{ width: number; left: number }>;

const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
  const { className, type = 'primary', activeIndex, items = [], onChange, underlined = true } = props;

  const tabsRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLUListElement>(null);

  const [direction, setDirection] = React.useState<PositionProps>([]);

  const classes = classNames(className, 'component-tabs', {
    [`${type}`]: type,
    [`${underlined}`]: underlined,
  });

  const filterPosition = React.useCallback((space: HTMLDivElement, inside: HTMLCollection) => {
    const { left: spaceLeft } = space.getBoundingClientRect();
    const siteMap: PositionProps = [];
    for (const element of inside) {
      const { width, left } = element.getBoundingClientRect();
      siteMap.push({ width, left });
    }
    const rectSize = siteMap.map((ele) => ({ ...ele, left: ele.left - spaceLeft }));
    return rectSize;
  }, []);

  React.useEffect(() => {
    if (!tabsRef.current || !innerRef.current || items.length === 0) return;
    const space = tabsRef.current;
    const inside = innerRef.current.children;
    const result = filterPosition(space, inside);
    setDirection(result);
  }, [tabsRef, items, filterPosition]);

  const [tabActive, setTabActive] = React.useState<number>(activeIndex || 0);

  React.useEffect(() => {
    if (activeIndex !== undefined) {
      setTabActive(activeIndex);
    }
  }, [activeIndex]);

  // handle event
  const handleChange = (ele: TabsObjectType, index: number) => {
    setTabActive(index);
    onChange?.(ele.value, index);
  };

  return (
    <div className={classes} ref={tabsRef}>
      <ul className="flex flex-row items-center justify-start" ref={innerRef}>
        {items.map((ele, index) => (
          <li
            className={`${ele?.disabled ? 'disabled-filter default' : tabActive === index ? 'active' : 'default'}`}
            key={ele.value}
            onClick={() => {
              if (ele?.disabled) return;
              handleChange(ele, index);
            }}
          >
            {ele?.icon} {ele.name}
          </li>
        ))}
      </ul>
      <hr className="bar" style={direction[tabActive]} />
    </div>
  );
};

export default Tabs;
