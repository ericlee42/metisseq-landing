import { baseGraphUrl } from '@/configs/common';
import BigNumber from 'bignumber.js';
import { gql, GraphQLClient } from 'graphql-request';

const userTxs = gql`
  query ClaimHistory($address: [String]) {
    histories(where: { action: Claim, sequencer_: { address_in: $address } }, first: 1000) {
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

const fetchClaimedRewards = async (addresses: string[], chainId: number, current?: any, pageSize?: any) => {
  if (!addresses?.length) throw new Error('Invalid Addresses');
  if (!chainId || !baseGraphUrl?.[chainId.toString()]) throw new Error('Invalid Client');
  const perpetualClient = new GraphQLClient(baseGraphUrl?.[chainId.toString()], {
    headers: {},
  });

  const _current = current || 0;
  const _pageSize = pageSize || 1000;
  const data: any = await perpetualClient.request(userTxs, {
    address: addresses,
    current: +_current,
    pageSize: +_pageSize,
  });

  let formattedData: any = {};
  data?.histories?.forEach((i) => {
    const signer = i?.sequencer?.address?.toLowerCase();
    if (!formattedData[signer]) {
      formattedData[signer] = {
        amount: '0',
        amountReadable: '0',
        symbol: 'METIS',
      };
    }

    const latestAmount = BigNumber(formattedData[signer]?.amount || '0')
    .plus(i?.amount || '0')
    .toString();

    formattedData[signer].amount = latestAmount

      formattedData[signer].amountReadable = BigNumber(latestAmount || '0')
      .div(1e18)
      .toString();
  });

  return formattedData;
};

export default fetchClaimedRewards;
