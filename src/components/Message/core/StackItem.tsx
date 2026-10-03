import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import type { NotificationStackItemProps } from '../types';

export default class StackItem extends React.Component<NotificationStackItemProps> {
  static defaultProps = { stayTime: 3_000 };
  state = { visible: true };

  private timeout = 3_000;

  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate(prevProps: NotificationStackItemProps) {
    const { stayTime } = prevProps;
    const { stayTime: newTime } = this.props;
    if (stayTime !== newTime) {
      this.stopTimer();
      this.startTimer();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  close = () => {
    this.stopTimer();
    this.setState({ visible: false }, this.props.onClose);
  };

  startTimer = () => {
    const { stayTime } = this.props;
    if (stayTime) {
      this.timeout = window.setTimeout(this.close, stayTime);
    }
  };

  stopTimer = () => {
    clearInterval(this.timeout);
  };

  render() {
    const { Component, ...rest } = this.props;
    const { visible } = this.state;

    return (
      <AnimatePresence>
        {visible && (
          <Component {...rest} onMouseEnter={this.stopTimer} onMouseLeave={this.startTimer} onClose={this.close} />
        )}
      </AnimatePresence>
    );
  }
}
