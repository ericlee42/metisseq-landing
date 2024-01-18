/**
 * The instant on-demand atomic CSS engine.
 * @see https://github.com/unocss/unocss
 */
import { defineConfig } from 'unocss';
import type { Rule, StaticRule } from '@unocss/core';

// https://github.com/action-hong/unocss-preset-scrollbar
// https://github.com/reslear/unocss-preset-scrollbar-hide

interface Theme {
  flex?: Record<string, string>;
}

const flex: Rule<Theme>[] = [
  ['flex', { display: 'flex' }],
  ['flex-row', { 'flex-direction': 'row' }],
  ['flex-col', { 'flex-direction': 'column' }],
  ['flex-col-reverse', { 'flex-direction': 'column-reverse' }],
  ['flex-row-reverse', { 'flex-direction': 'row-reverse' }],
  ['flex-wrap', { 'flex-wrap': 'wrap' }],
  ['flex-nowrap', { 'flex-wrap': 'nowrap' }],
  ['self-start', { 'align-self': 'flex-start' }],
  ['self-end', { 'align-self': 'flex-end' }],
  [/^flex-([\.\d]+)$/, ([_, num]) => ({ flex: `${num}` })],
];

const alignments: StaticRule[] = [
  ['items-start', { 'align-items': 'flex-start' }],
  ['items-end', { 'align-items': 'flex-end' }],
  ['items-center', { 'align-items': 'center' }],
  ['items-stretch', { 'align-items': 'stretch' }],
  ['items-baseline', { 'align-items': 'baseline' }],
];

const justifies: StaticRule[] = [
  ['justify-start', { 'justify-content': 'flex-start' }],
  ['justify-end', { 'justify-content': 'flex-end' }],
  ['justify-center', { 'justify-content': 'center' }],
  ['justify-between', { 'justify-content': 'space-between' }],
];

const custom: Rule[] = [
  ['front', { color: '#29c18b !important' }],
  ['verso', { color: '#fd4772 !important' }],
  ['gain', { background: '#29c18b !important' }],
  ['loss', { background: '#fd4772 !important' }],
  ['yellow', { color: '#ffd53e' }],
  [
    'ellipsis',
    {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap',
    },
  ],
  [
    /^white-space-([\.\s\S]+)$/,
    ([_, param]) => ({ 'white-space': `${param}!important` }),
  ],
  [/^color-([\.\s\S]+)$/, ([_, param]) => ({ color: `#${param}!important` })],
  [/^bg-color-([\.\s\S]+)$/, ([_, param]) => ({ background: `#${param}!important` })],
  [/^bg-image-([\.\s\S]+)$/, ([_, param]) => ({ 'background-image': `${param}!important` })],
  [/^z-([\.\s\S]+)$/, ([_, param]) => ({ 'z-index': `${param}` })],
  [/^position-([\.\s\S]+)$/, ([_, param]) => ({ position: `${param}!important` })],
  [/^top-([\.\d]+)$/, ([_, param]) => ({ top: `${param}px` })],
  [/^topc-([\.\s\S]+)$/, ([_, param]) => ({ top: `${param}` })],
  [/^left-([\.\d]+)$/, ([_, param]) => ({ left: `${param}px` })],
  [/^topr-([\.\d]+)$/, ([_, param]) => ({ top: `${param}%` })],
  [/^leftr-([\.\d]+)$/, ([_, param]) => ({ left: `${param}%` })],
  [/^bottom-([\.\d]+)$/, ([_, param]) => ({ bottom: `${param}px` })],
  [/^right-([\.\d]+)$/, ([_, param]) => ({ right: `${param}px` })],
  [/^translateXr-([\.\s\S]+)$/, ([_, param]) => ({ transform: `translateX(${param}%)` })],
  [/^translateX-([\.\s\S]+)$/, ([_, param]) => ({ transform: `translateX(${param}px)` })],
  [/^translateYr-([\.\s\S]+)$/, ([_, param]) => ({ transform: `translateY(${param}%)` })],
  [/^translateY-([\.\s\S]+)$/, ([_, param]) => ({ transform: `translateY(${param}px)` })],
  ['translateCenter', { transform: 'translate(-50%, -50%)' }],
  ['translateYTop', { transform: 'translate(-50%, -100%)' }],
  ['translateYBottom', { transform: 'translate(-50%, 100%)' }],
  [/^whiteSpace-([\.\s\S]+)$/, ([_, param]) => ({ 'white-space': `${param}` })],
];

const margin: Rule[] = [
  ['m-auto', { margin: 'auto' }],
  [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
  [/^mt-([\.\d]+)$/, ([_, num]) => ({ 'margin-top': `${num}px!important` })],
  [/^ml-([\.\d]+)$/, ([_, num]) => ({ 'margin-left': `${num}px` })],
  [/^mr-([\.\d]+)$/, ([_, num]) => ({ 'margin-right': `${num}px` })],
  [/^mb-([\.\d]+)$/, ([_, num]) => ({ 'margin-bottom': `${num}px` })],
];

const padding: Rule[] = [
  [/^p-([\.\d]+)$/, ([_, num]) => ({ padding: `${num}px!important` })],
  [/^pt-([\.\d]+)$/, ([_, num]) => ({ 'padding-top': `${num}px!important` })],
  [/^pl-([\.\d]+)$/, ([_, num]) => ({ 'padding-left': `${num}px!important` })],
  [/^pr-([\.\d]+)$/, ([_, num]) => ({ 'padding-right': `${num}px!important` })],
  [/^pb-([\.\d]+)$/, ([_, num]) => ({ 'padding-bottom': `${num}px!important` })],
];

const gap: Rule[] = [[/^gap-([\.\d]+)$/, ([_, num]) => ({ gap: `${num}px` })]];

const font: Rule[] = [
  [/^fz-([\.\d]+)$/, ([_, num]) => ({ 'font-size': `${num}px!important` })],
  [/^fw-([\.\d]+)$/, ([_, num]) => ({ 'font-weight': `${num}!important` })],
  [/^lh-([\.\d]+)$/, ([_, num]) => ({ 'line-height': `${num}%` })],
  [
    'sans',
    {
      'font-family': 'HarmonyOS_Sans',
    },
  ],
  [
    'raleway',
    {
      'font-family': 'Raleway',
    },
  ],
  [
    'inter',
    {
      'font-family': 'Inter',
    },
  ],
  [
    'poppins',
    {
      'font-family': 'Poppins-Regular',
    },
  ],


];

const size: Rule[] = [
  ['w-full', { width: '100%!important' }],
  ['h-full', { height: '100%' }],
  [/^w-([\.\d]+)$/, ([_, num]) => ({ width: `${num}px` })],
  [/^wp-([\.\d]+)$/, ([_, num]) => ({ width: `${num}%` })],
  [/^minw-([\.\d]+)$/, ([_, num]) => ({ 'min-width': `${num}px` })],
  [/^maxw-([\.\d]+)$/, ([_, num]) => ({ 'max-width': `${num}px` })],
  [/^maxwp-([\.\d]+)$/, ([_, num]) => ({ 'max-width': `${num}%` })],
  [/^h-([\.\d]+)$/, ([_, num]) => ({ height: `${num}px` })],
  [/^s-([\.\d]+)$/, ([_, num]) => ({ width: `${num}px`, height: `${num}px` })],
];

const radius: Rule[] = [
  [/^radius-([\.\d]+)$/, ([_, num]) => ({ 'border-radius': `${num}px!important` })],
  [/^radiusp-([\.\d]+)$/, ([_, num]) => ({ 'border-radius': `${num}%` })],
];

const align: Rule[] = [
  [/^align-([\.\s\S]+)$/, ([_, param]) => ({ 'text-align': `${param}` })],
];

export default defineConfig({
  presets: [], // disable default preset
  rules: [
    ...flex,
    ...alignments,
    ...justifies,
    ...custom,
    ...margin,
    ...padding,
    ...gap,
    ...font,
    ...size,
    ...align,
    ...radius,
  ],
});
