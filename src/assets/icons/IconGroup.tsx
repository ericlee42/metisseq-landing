import * as React from 'react';
interface Props extends Omit<React.SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: React.CSSProperties = {
  display: 'inline-block',
};

const getIconColor = (color: string | string[] | undefined, index: number, defaultColor: string) => {
  return color ? (typeof color === 'string' ? color : color[index] || defaultColor) : defaultColor;
};

export const IconGlobalSpin: React.FC<Props> = ({ size = 16, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 22 22" width={`${size}px`} height={`${size}px`} style={style} {...rest}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2ZM0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11Z"
        fill={getIconColor(color, 1, '#ffffff')}
        fillOpacity="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C17.0745 0 22 4.92549 22 11H20C20 6.03006 15.9699 2 11 2V0Z"
        fill={getIconColor(color, 1, '#ffffff')}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 11 11"
          to="360 11 11"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

export const IconPaginationArrowLeft: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M10.4685 6.65362L4.30527 1.83976C4.28917 1.82708 4.26981 1.8192 4.24943 1.81702C4.22905 1.81485 4.20847 1.81846 4.19005 1.82746C4.17164 1.83645 4.15613 1.85046 4.14531 1.86787C4.1345 1.88528 4.12881 1.90539 4.12891 1.92589V2.98272C4.12891 3.04972 4.16035 3.11397 4.21231 3.15499L9.13417 6.99815L4.21231 10.8413C4.15899 10.8823 4.12891 10.9466 4.12891 11.0136V12.0704C4.12891 12.162 4.23418 12.2126 4.30527 12.1566L10.4685 7.34269C10.5209 7.30182 10.5633 7.24955 10.5924 7.18985C10.6216 7.13015 10.6367 7.06459 10.6367 6.99815C10.6367 6.93172 10.6216 6.86616 10.5924 6.80646C10.5633 6.74675 10.5209 6.69448 10.4685 6.65362Z" />
    </svg>
  );
};

export const IconPaginationArrowRight: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M9.8987 2.98284V1.926C9.8987 1.8344 9.79343 1.78381 9.72233 1.83987L3.55905 6.65374C3.50669 6.69446 3.46431 6.74661 3.43517 6.8062C3.40602 6.86579 3.39087 6.93125 3.39087 6.99758C3.39087 7.06392 3.40602 7.12938 3.43517 7.18897C3.46431 7.24856 3.50669 7.30071 3.55905 7.34143L9.72233 12.1553C9.7948 12.2114 9.8987 12.1608 9.8987 12.0692V11.0123C9.8987 10.9453 9.86726 10.8811 9.8153 10.8401L4.89343 6.99827L9.8153 3.1551C9.86726 3.11409 9.8987 3.04983 9.8987 2.98284Z" />
    </svg>
  );
};
