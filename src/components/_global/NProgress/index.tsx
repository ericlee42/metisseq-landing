import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import * as React from 'react';

export default function NProgress() {
  React.useEffect(() => {
    nprogress.start();
    return () => {
      nprogress.done();
    };
  }, []);

  return <React.Fragment />;
}
