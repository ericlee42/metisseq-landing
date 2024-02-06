import * as React from 'react';
import { Tabs } from '@/components';
import './index.scss';

import cw from '@/components/TradingView/substanceV2';
import usePositionListeners from '@/hooks/listeners/usePositionListeners';
import useFuturePositions from '@/hooks/perpetual/useFuturePositions';
import useAuth from '@/hooks/useAuth';
import PerpetualPosition from '@/pages/Perpetual/_components/Position';
import OptionPosition from '@/pages/Options/_components/Position';
import NoData from '@/components/_global/NoData';
import useOptionPosition from '@/hooks/option/useOptionPosition';

function ProfilePosition() {
  const [tabValue, setTabValue] = React.useState<0 | 1>(0);
  const { address, chainId } = useAuth(true);

  const { combinedPosition: perpetualCombinedPosition } = usePositionListeners();
  const { run: futurePositionRun, cancel: futurePositionCancel } = useFuturePositions();
  const { combinedPosition: optionCombinedPosition } = useOptionPosition();

  React.useEffect(() => {
    if (address && chainId) {
      futurePositionRun(address);
    } else {
      futurePositionCancel();
    }
  }, [address, chainId]);

  React.useEffect(() => {
    cw.init();
  }, []);

  return (
    <React.Fragment>
      <div className="position title">
        <h2>Active Position</h2>
        <Tabs
          className="tabs"
          items={[
            { name: 'Perpetual', value: 0 },
            { name: 'Options', value: 1 },
          ]}
          onChange={(v) => setTabValue(v)}
        />
      </div>
      <div className="components-profile-position flex-1">
        {tabValue === 1 ? (
          !optionCombinedPosition?.length ? (
            <NoData style={{ position: 'relative' }} />
          ) : (
            optionCombinedPosition?.map((ele: any, index: React.Key | null | undefined) => (
              <OptionPosition key={index} ele={ele} />
            ))
          )
        ) // <table>
        //   <thead>
        //     <tr>
        //       <th>Symbol</th>
        //       <th>Position</th>
        //       <th>Strike Price</th>
        //       <th>Mark Price</th>
        //       <th>PNL</th>
        //       <th>Entry Price</th>
        //       <th>Current Price</th>
        //       <th>Expires in</th>
        //       <th>Action</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {!optionCombinedPosition?.length ? (
        //       <NoData />
        //     ) : (
        //       optionCombinedPosition?.map((ele: any, index: React.Key | null | undefined) => (
        //         <OptionPosition key={index} ele={ele} />
        //       ))
        //     )}
        //   </tbody>
        // </table>
        : null}

        {tabValue === 0 ? (
          perpetualCombinedPosition?.length ? (
            perpetualCombinedPosition?.map((ele: any) => (
              <PerpetualPosition
                // handleCurrentOrder={handleCurrentOrder}
                // showCollateral={() => {
                //   setModalVisible(true);
                // }}
                ele={ele}
              />
            ))
          ) : (
            <NoData style={{ position: 'relative' }} />
          )
        ) : null}
      </div>
    </React.Fragment>
  );
}

export default ProfilePosition;
