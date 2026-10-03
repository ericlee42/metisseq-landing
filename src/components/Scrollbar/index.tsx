import { MacScrollbar, MacScrollbarProps } from 'mac-scrollbar';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import * as React from 'react';
import { cloneElement } from '../_util/reactNode';
import './index.css';

type ScrollbarProps = MacScrollbarProps;

const Scrollbar: React.FC<ScrollbarProps> = (props: ScrollbarProps) => {
  const { children, ...rest } = props;

  return (
    <MacScrollbar
      className="component-scrollbar"
      skin="dark"
      thumbStyle={(horizontal) => ({
        [horizontal ? 'height' : 'width']: 4,
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 6,
      })}
      trackStyle={(horizontal) => ({ [horizontal ? 'bottom' : 'right']: 1, width: 0, border: 0 })}
      trackGap={[4, 4, 4, 4]}
      {...rest}
    >
      {cloneElement(children)}
    </MacScrollbar>
  );
};

export default Scrollbar;
