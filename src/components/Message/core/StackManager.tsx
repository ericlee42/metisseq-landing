import * as React from 'react';
import ReactDOM from 'react-dom/client';
import type { NotificationProps, NotificationReturnInstance } from '../types';
import StackItem from './StackItem';

export default class StackManager {
  private notifyList: Array<{ key: string; ref: React.RefObject<StackItem | null>; element: React.ReactElement }> = [];
  private component: React.FunctionComponent<NotificationProps>;
  private root?: ReactDOM.Root;
  private keySeed = 0;

  constructor(component: React.FunctionComponent<NotificationProps>) {
    this.component = component;
    this.root = ReactDOM.createRoot(this.getContainerDom(true));
  }
  open(props: NotificationProps): NotificationReturnInstance {
    const newKey = props.key || String((this.keySeed += 1));
    const newRef = React.createRef<StackItem>();
    const stackItem = <StackItem {...props} key={newKey} ref={newRef} Component={this.component} />;
    const existingIndex = this.notifyList.findIndex((item) => item.key === newKey);
    if (existingIndex === -1) {
      this.notifyList.push({ key: newKey, ref: newRef, element: stackItem });
    } else {
      this.notifyList[existingIndex] = { key: newKey, ref: newRef, element: stackItem };
    }
    this.render();
    return { close: () => this.close(newKey) };
  }
  close(key: string) {
    const notify = this.notifyList.find((item) => item.key === key);
    if (notify) {
      const { current } = notify.ref;
      current?.close();
    }
  }
  closeAll() {
    this.notifyList.forEach((notify) => {
      const { current } = notify.ref;
      current?.close();
    });
  }
  destroy() {
    this.notifyList.length = 0;
    const div = this.getContainerDom();
    if (div) {
      this.root?.unmount();
      window.document.body.removeChild(div);
    }
  }

  private render() {
    const list = this.notifyList.map((item) => item.element);
    this.root?.render(<>{list}</>);
  }

  private getContainerDom(create?: boolean) {
    let div = this.getPortalDom();
    if (!div && create) {
      div = window.document.createElement('div');
      div.id = 'global-bedrock';
      window.document.body.appendChild(div);
    }
    return div as HTMLDivElement;
  }
  private getPortalDom() {
    return window.document.getElementById('global-bedrock');
  }
}
