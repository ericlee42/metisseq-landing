import * as React from 'react';
import { createPortal } from 'react-dom';
import { fadeConfig } from '@/configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { cloneElement } from '../_util/reactNode';
import { useBoolean, useHover, useDebounceEffect } from 'ahooks';
import './index.scss';

const DIRECTION_MAP = {
  top: 'top' as const,
  topLeft: 'top-start' as const,
  topRight: 'top-end' as const,
  bottom: 'bottom' as const,
  bottomLeft: 'bottom-start' as const,
  bottomRight: 'bottom-end' as const,
};

const ARROW_OFFSET = 18.5 as const;

const ARROW_POSITION = { start: '6%' as const, end: '94%' as const };

type TooltipPlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

export interface TooltipProps {
  placement?: TooltipPlacement;
  title?: React.ReactNode;
  children?: React.ReactNode;
  underline?: boolean;
}

interface TriggerProps extends TooltipProps {
  followRef: React.RefObject<HTMLDivElement>;
  followID?: string;
}

interface PositionProps {
  top: number;
  left: number;
}

const Portal: React.FC<TriggerProps> = (props: TriggerProps) => {
  const { followRef, followID, placement = 'top', title } = props;

  const innerRef = React.useRef<HTMLDivElement>(null);
  const [direction, setDirection] = React.useState<PositionProps>();
  const [extraX, extraY] = DIRECTION_MAP[placement].split('-');

  const filterPosition = React.useCallback(
    (follow: DOMRect, inside: DOMRect) => {
      const { top: followTop, left: followLeft, width: followWidth, height: followHeight } = follow;
      const { width: innerWidth, height: innerHeight } = inside;
      const siteMap = {
        start: followLeft - ARROW_OFFSET,
        center: followWidth / 2 + followLeft - innerWidth / 2,
        end: followLeft + followWidth - innerWidth + ARROW_OFFSET,
      };
      const size: PositionProps = {
        top: extraX === 'top' ? followTop - innerHeight : followTop + followHeight,
        left: siteMap[extraY || 'center'],
      };
      return size;
    },
    [extraX, extraY],
  );

  React.useEffect(() => {
    if (!followRef.current || !innerRef.current) return;
    const follow = followRef.current.getBoundingClientRect();
    const inside = innerRef.current.getBoundingClientRect();
    const result = filterPosition(follow, inside);
    setDirection(result);
  }, [followRef, innerRef, filterPosition]);

  const memoElement = React.useMemo(() => {
    const arrowMove = ARROW_POSITION[extraY] || '50%';
    return (
      <motion.div
        className="component-tooltip"
        ref={innerRef}
        id={followID}
        style={direction}
        onClick={(e) => e.stopPropagation()}
        {...fadeConfig}
      >
        <div className={`tooltip tooltip-${extraX}`}>
          <div className="content">{cloneElement(title)}</div>
          <div className="arrow" style={{ left: arrowMove, transform: `translateX(-${arrowMove})` }} />
        </div>
      </motion.div>
    );
  }, [extraY, followID, direction, title, extraX]);

  return createPortal(memoElement, window.document.body as HTMLElement);
};

const Tooltip: React.FC<TooltipProps> = (props: TooltipProps) => {
  const { children } = props;

  const followRef = React.useRef<HTMLDivElement>(null);
  const uuid = React.useId();

  const [state, { setTrue, setFalse }] = useBoolean(false);

  // handle event
  const hoverFollow = useHover(followRef, { onEnter: setTrue });
  const hoverPortal = useHover(() => window.document.getElementById(uuid), {
    onLeave: setFalse,
  });

  const handleClose = React.useCallback(() => {
    if (hoverFollow || hoverPortal) return;
    setFalse();
  }, [hoverFollow, hoverPortal, setFalse]);

  useDebounceEffect(() => handleClose(), [hoverFollow, hoverPortal], { wait: 150 });

  return (
    <React.Fragment>
      {cloneElement(children, { ref: followRef })}
      <AnimatePresence>{state && <Portal followRef={followRef} followID={uuid} {...props} />}</AnimatePresence>
    </React.Fragment>
  );
};

export default Tooltip;
