import * as React from 'react';
import classNames from 'classnames';
import useDrag from './hook/useDrag';
import useOffset from './hook/useOffset';
import './style/index.scss';

export interface SliderProps {
  className?: string;
  disabled?: boolean;
  value: number;
  min?: number;
  max?: number;
  step?: number; // must >0, mod (max - min) = 0
  unit?: React.ReactNode;
  marks?: number[];
  tooltip?: React.ReactNode;
  onChange?: (value: number) => void;
}

type OnStartMove = (e: React.MouseEvent | React.TouchEvent) => void;

const Slider = (props: SliderProps) => {
  const {
    className,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    value = 0,
    unit = '%',
    marks,
    tooltip,
    onChange,
  } = props;

  const classes = classNames(className, 'component-slider', {});

  const sliderRef = React.useRef<HTMLDivElement>(null);

  const [formatValue, offsetValues] = useOffset(min, max, step);

  const rawValues = React.useMemo(() => {
    const newValue = Math.max(min, Math.min(max, value));
    return [newValue] as number[];
  }, [max, min, value]);

  const rawValuesRef = React.useRef(rawValues);
  rawValuesRef.current = rawValues;

  const triggerChange = (nextValues: number[]) => {
    onChange?.(nextValues[0]);
  };

  const onSliderMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!sliderRef.current) return;
    e.preventDefault();

    const { width, left } = sliderRef.current.getBoundingClientRect();
    const { clientX } = e;

    const percent = (clientX - left) / width;
    const nextValue = min + percent * (max - min);

    if (!disabled) {
      onChange?.(formatValue(nextValue));
    }
  };

  const [draggingIndex, onStartDrag] = useDrag(sliderRef, rawValues, min, max, triggerChange, offsetValues);

  const onStartMove: OnStartMove = (e) => {
    onStartDrag(e);
  };

  const track = React.useMemo(() => {
    const offsetEnd = (Math.max(min, rawValues[0]) - min) / (max - min);
    return offsetEnd * 100;
  }, [min, rawValues, max]);

  const onInternalStartMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!disabled) {
      onStartMove(e);
    }
  };

  const sliderMarks = React.useMemo(() => {
    if (!marks || marks.length < 3) return null;
    return marks.map((ele) => {
      const result = ((Math.max(min, ele) - min) / (max - min)) * 100;
      return (
        <li key={ele} style={{ left: `${result}%` }}>
          <hr className={`mark-dot ${track >= result ? 'active' : 'default'}`} />
          <p className="mark-value">
            {ele}
            {unit}
          </p>
        </li>
      );
    });
  }, [marks, min, max, track, unit]);

  return (
    <div className={classes} ref={sliderRef} onMouseDown={onSliderMouseDown}>
      <div className="rail">
        <hr className="track" style={{ clipPath: `inset(0 ${100 - (track || 0)}% 0 0)` }} />
      </div>
      <hr
        className={classNames('handle', { dragging: draggingIndex === 0 })}
        style={{ left: `${track}%` }}
        onMouseDown={onInternalStartMove}
        onTouchStart={onInternalStartMove}
      />
      <ul className="mark">{sliderMarks}</ul>
      <div className="tooltip" style={{ left: `${track}%` }}>
        {tooltip ?? `${rawValues[0]}${unit}`}
      </div>
    </div>
  );
};

export default Slider;
