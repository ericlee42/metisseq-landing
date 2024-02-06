import { baseGraphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

const userTxs = gql`
  query MyQuery {
    lockedUserParams {
      amount
      block
      fromTimestamp
      id
      signerPubkey
      user
      sequencerId
      claimAmount
    }
  }
`;

const fetchOverview = async (chainId?: number) => {
  if (!chainId || !baseGraphUrl?.[chainId.toString()]) return undefined;

  const perpetualClient = new GraphQLClient(baseGraphUrl?.[chainId.toString()], {
    headers: {},
  });

  const data: any = await perpetualClient.request(userTxs);
  return data;
};

export default fetchOverview;
