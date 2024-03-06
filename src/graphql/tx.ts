import { baseGraphUrl } from '@/configs/common';
import BigNumber from 'bignumber.js';
import { gql, GraphQLClient } from 'graphql-request';

const userTxs = gql`
  query TxHistory($address: String) {
    rewardBatches {
      endEpoch
      rpb
      id
      startEpoch
      timestamp
      total
    }
    histories(where: { sequencer_: { address: $address } }) {
      action
      amount
      block
      txHash
      timestamp
      txOrigin
      sequencer {
        address
        claimed
        id
        status
        pubkey
      }
      id
    }
  }
`;

const fetchUserTx = async (address: string, chainId: number, current?: any, pageSize?: any) => {
  if (!address) throw new Error('Invalid Address');
  if (!chainId || !baseGraphUrl?.[chainId.toString()]) throw new Error('Invalid Client');
  const perpetualClient = new GraphQLClient(baseGraphUrl?.[chainId.toString()], {
    headers: {},
  });

  const _address = address.toString().toLowerCase();
  const _current = current || 0;
  const _pageSize = pageSize || 1000;
  const data: any = await perpetualClient.request(userTxs, {
    address: _address,
    current: +_current,
    pageSize: +_pageSize,
  });

  const tempData = JSON.parse(JSON.stringify(data?.histories));
  const lockAmount = tempData?.find((i) => i.action === 'Lock');

  let prevRelockAmount = '0';
  const formattedData = data?.histories?.map((i) => {
    let deltaAmountReadable;
    let deltaAmount;
    const amountReadable = BigNumber(i?.amount).div(1e18).toString();
    if (i.action === 'Relock') {
      deltaAmount = BigNumber(i?.amount).minus('0').minus('0').toString();
      deltaAmountReadable = BigNumber(deltaAmount).div(1e18).toString();
      prevRelockAmount = BigNumber(prevRelockAmount).plus(deltaAmount).toString();
    }
    return {
      ...i,
      amountReadable,
      deltaAmountReadable,
      symbol: 'METIS',
    };
  });

  return { histories: formattedData,
rewardBatches: data?.rewardBatches };
  // return { ...formattedData, sequencer: data?.histories?.[data?.histories?.length - 1]?.sequencer || {}};
};

export default fetchUserTx;
