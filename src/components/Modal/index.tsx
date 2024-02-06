import * as React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { maskConfig, modalConfig } from '@/configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { RemoveScroll } from 'react-remove-scroll';
import { cloneElement } from '../_util/reactNode';
import { getImageUrl } from '@/utils/tools';
import { Scrollbar, Button } from '../';
import './index.scss';
import { useClickAway } from 'ahooks';

export interface ModalProps {
  middleHeader?: boolean;
  className?: string;
  visible?: boolean;
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

const Portal: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    visible,
    middleHeader,
    className,
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

  const ref = React.useRef<HTMLButtonElement>(null);
  // useClickAway(() => {
  //   if (visible) {
  //     onClose?.();
  //   }
  // }, ref);

  const handleCloseWithMask = (e) => {
    e.stopPropagation();
    if (visible && e.target === ref.current) {
      onClose?.();
    }
  };

  const classes = classNames(className, 'component-modal flex flex-col items-stretch justify-center', {});

  const handleCancel = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      onCancel?.(e) || onClose?.();
    },
    [onCancel, onClose],
  );

  const handleOk = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onOk?.(e);
    },
    [onOk],
  );

  const renderHeader = React.useMemo(() => {
    return (
      <div className={`header flex flex-row items-center justify-between ${middleHeader ? 'middle-header' : ''}`}>
        <h2 className="title">{title}</h2>
        {closable && (
          <img
            className="close"
            src={getImageUrl('@/assets/images/_global/ic_close.svg')}
            alt="icon"
            onClick={handleCancel}
          />
        )}
      </div>
    );
  }, [title, closable, handleCancel]);

  const renderFooter = React.useMemo(() => {
    return (
      <div className="footer flex flex-row items-center justify-between">
        {cancel && (
          <Button type="second" onClick={handleCancel}>
            {cancel}
          </Button>
        )}
        {ok && (
          <Button type="solid" loading={loading} disabled={disabled} onClick={handleOk}>
            {ok}
          </Button>
        )}
      </div>
    );
  }, [loading, disabled, cancel, ok, handleCancel, handleOk]);

  const memoElement = React.useMemo(() => {
    const renderPortal = (
      <motion.div className={classes} {...maskConfig} onClick={handleCloseWithMask} ref={ref}>
        <motion.div
          // ref={ref}
          className="inside flex flex-col items-stretch justify-between"
          {...modalConfig}
        >
          {(title || closable) && renderHeader}
          <Scrollbar className="content">{cloneElement(children)}</Scrollbar>
          {(cancel || ok) && renderFooter}
        </motion.div>
      </motion.div>
    );

    return <RemoveScroll>{renderPortal}</RemoveScroll>;
  }, [classes, title, closable, renderHeader, children, cancel, ok, renderFooter]);

  return createPortal(memoElement, window.document.body);
};

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const { visible = false } = props;

  return <AnimatePresence>{visible && <Portal {...props} visible={visible} />}</AnimatePresence>;
};

export default Modal;
