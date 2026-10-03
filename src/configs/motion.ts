import { HTMLMotionProps, Variant } from 'framer-motion';

type MotionVariants<T extends string> = Record<T, Variant>;

const easings: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
};
type FadeMotionVariant = MotionVariants<'enter' | 'exit'>;

const fadeVariants: FadeMotionVariant = {
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: easings.easeOut,
    },
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
};

export const fadeConfig: HTMLMotionProps<any> = {
  initial: 'exit',
  animate: 'enter',
  exit: 'exit',
  variants: fadeVariants,
};

type MotionVariant = MotionVariants<'enter' | 'exit'>;
const maskVariants: MotionVariant = {
  exit: {
    opacity: 0,
    transition: {
      delay: 0.24,
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
};

export const maskConfig: HTMLMotionProps<any> = {
  initial: 'exit',
  animate: 'enter',
  exit: 'exit',
  variants: maskVariants,
};
const modalVariants: MotionVariant = {
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: easings.easeOut,
    },
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.easeIn,
    },
  },
};

export const modalConfig: HTMLMotionProps<any> = {
  initial: 'exit',
  animate: 'enter',
  exit: 'exit',
  variants: modalVariants,
};
const messageVariants: MotionVariant = {
  exit: {
    opacity: 0,
    y: 0,
    transition: {
      duration: 0.1,
      ease: easings.easeOut,
    },
  },
  enter: {
    opacity: 1,
    y: 18,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
};

export const messageConfig: HTMLMotionProps<any> = {
  initial: 'exit',
  animate: 'enter',
  exit: 'exit',
  variants: messageVariants,
};
