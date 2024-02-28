import * as React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { maskConfig, popupConfig } from '@/configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { RemoveScroll } from 'react-remove-scroll';
import { cloneElement } from '../_util/reactNode';
import { getImageUrl } from '@/utils/tools';
import { Button } from '../';
import './index.scss';

export interface PopupProps {
  className?: string;
  visible?: boolean;
  unusual?: 'buy' | 'sell';
  title?: React.ReactNode;
  closable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  cancel?: React.ReactNode;
  ok?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  onOk?: (...args: any[]) => any;
}

const Portal: React.FC<PopupProps> = (props: PopupProps) => {
  const {
    className,
    unusual,
    title,
    closable = true,
    loading = false,
    disabled = false,
    cancel,
    ok,
    children,
    onClose,
    onCancel,
    onOk,
  } = props;

  const classes = classNames(className, 'component-popup');

  const handleCancel = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      onCancel?.(e);
    },
    [onCancel],
  );

  const handleOk = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onOk?.(e);
    },
    [onOk],
  );

  const renderHeader = React.useMemo(() => {
    return (
      <div className="header flex flex-row items-center justify-between">
        <div className="title">{title}</div>
        {closable && (
          <img
            className="close"
            src={getImageUrl('@/assets/images/_global/icon-close.svg')}
            alt="icon"
            onClick={() => {
              if (onClose) {
                onClose();
                return;
              }
              onCancel?.();
            }}
          />
        )}
      </div>
    );
  }, [title, closable, onClose, onCancel]);

  const renderFooter = React.useMemo(() => {
    return (
      <div className="footer flex flex-row items-center justify-between">
        {cancel && (
          <Button type="second" onClick={handleCancel}>
            {cancel}
          </Button>
        )}
        {ok && (
          <Button className={`${unusual}-button`} loading={loading} disabled={disabled} onClick={handleOk}>
            {ok}
          </Button>
        )}
      </div>
    );
  }, [unusual, loading, disabled, cancel, ok, handleCancel, handleOk]);

  const memoElement = React.useMemo(() => {
    return (
      <RemoveScroll>
        <motion.div className={classes} {...maskConfig}>
          <motion.div className="inside flex flex-col items-stretch justify-between" {...popupConfig}>
            {renderHeader}
            <div className="content">{cloneElement(children)}</div>
            {(cancel || ok) && renderFooter}
          </motion.div>
        </motion.div>
      </RemoveScroll>
    );
  }, [classes, cancel, ok, renderHeader, children, renderFooter]);

  return createPortal(memoElement, window.document.body);
};

const Popup: React.FC<PopupProps> = (props: PopupProps) => {
  const { visible = false } = props;

  return <AnimatePresence>{visible && <Portal {...props} />}</AnimatePresence>;
};

export default Popup;
