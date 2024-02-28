import { baseGraphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

const userTxs = gql`
  query MyQuery {
    histories {
      action
      amount
      block
      txHash
      timestamp
      txOrigin
      sequencer {
        address
        id
        status
        pubkey
      }
      id
    }
  }
`;

const fetchOverview = async (chainId?: number) => {
  if (!chainId || !baseGraphUrl?.[chainId.toString()]) return undefined;

  const perpetualClient = new GraphQLClient(baseGraphUrl?.[chainId.toString()], {
    headers: {},
  });

  const data: any = await perpetualClient.request(userTxs);
  return data?.histories?.filter((i) => i.action === 'Lock');
};

export default fetchOverview;
