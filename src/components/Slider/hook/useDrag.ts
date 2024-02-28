import * as React from 'react';
import type { OffsetValues } from './useOffset';

type OnStartMove = (e: React.MouseEvent | React.TouchEvent) => void;

function getPosition(e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) {
  const obj = 'touches' in e ? e.touches[0] : e;

  return { pageX: obj.pageX, pageY: obj.pageY };
}

export default function useDrag(
  containerRef: React.RefObject<HTMLDivElement>,
  rawValues: number[],
  min: number,
  max: number,
  triggerChange: (values: number[]) => void,
  offsetValues: OffsetValues,
): [number, OnStartMove] {
  const [draggingIndex, setDraggingIndex] = React.useState(-1);
  const [cacheValues, setCacheValues] = React.useState(rawValues);
  const [originValues, setOriginValues] = React.useState(rawValues);

  const mouseMoveEventRef = React.useRef<((event: MouseEvent | TouchEvent) => void) | null>(null);
  const mouseUpEventRef = React.useRef<((event: MouseEvent | TouchEvent) => void) | null>(null);

  React.useEffect(() => {
    if (draggingIndex === -1) {
      setCacheValues(rawValues);
    }
  }, [rawValues, draggingIndex]);

  // Clean up event
  React.useEffect(() => {
    if (!mouseMoveEventRef.current || !mouseUpEventRef.current) return;

    window.document.removeEventListener('mousemove', mouseMoveEventRef.current);
    window.document.removeEventListener('mouseup', mouseUpEventRef.current);
    window.document.removeEventListener('touchmove', mouseMoveEventRef.current);
    window.document.removeEventListener('touchend', mouseUpEventRef.current);
  }, []);

  const flushValues = (nextValues: number[]) => {
    if (cacheValues.some((val, i) => val !== nextValues[i])) {
      setCacheValues(nextValues);
      triggerChange(nextValues);
    }
  };

  const updateCacheValue = (offsetPercent: number) => {
    // Basic point offset
    const offsetDist = (max - min) * offsetPercent;

    const cloneValues = [...cacheValues];
    cloneValues[0] = originValues[0];

    const next = offsetValues(cloneValues, offsetDist, 0, 'dist');

    flushValues(next.values);
  };

  // Resolve closure
  const updateCacheValueRef = React.useRef(updateCacheValue);
  updateCacheValueRef.current = updateCacheValue;

  const onStartMove: OnStartMove = (e) => {
    e.stopPropagation();

    setDraggingIndex(0);
    setOriginValues(rawValues);

    const { pageX: startX } = getPosition(e);

    // Moving
    const onMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      event.preventDefault();

      const { pageX: moveX } = getPosition(event);
      const offsetX = moveX - startX;

      const { width } = containerRef.current.getBoundingClientRect();

      const offSetPercent = offsetX / width;
      updateCacheValueRef.current(offSetPercent);
    };

    // End
    const onMouseUp = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      window.document.removeEventListener('mouseup', onMouseUp);
      window.document.removeEventListener('mousemove', onMouseMove);
      window.document.removeEventListener('touchend', onMouseUp);
      window.document.removeEventListener('touchmove', onMouseMove);
      mouseMoveEventRef.current = null;
      mouseUpEventRef.current = null;

      setDraggingIndex(-1);
    };

    window.document.addEventListener('mouseup', onMouseUp, { passive: false });
    window.document.addEventListener('mousemove', onMouseMove, { passive: false });
    window.document.addEventListener('touchend', onMouseUp, { passive: false });
    window.document.addEventListener('touchmove', onMouseMove, { passive: false });
    mouseMoveEventRef.current = onMouseMove;
    mouseUpEventRef.current = onMouseUp;
  };

  // const returnValues = React.useMemo(() => {
  //   const sourceValues = rawValues;
  //   const targetValues = cacheValues;

  //   return sourceValues.every((val, index) => val === targetValues[index]) ? cacheValues : rawValues;
  // }, [rawValues, cacheValues]);

  return [draggingIndex, onStartMove];
}
