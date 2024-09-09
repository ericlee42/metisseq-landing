import { baseGraphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

// const userTxs = gql`
//   query MyQuery {
//     histories {
//       action
//       amount
//       block
//       txHash
//       timestamp
//       txOrigin
//       sequencer {
//         address
//         id
//         status
//         pubkey
//         owner
//       }
//       id
//     }
//   }
// `;

const sequencerFilter = gql`
  query MyQuery {
    sequencers {
      id
      address
      locked
      totalReward
      claimed
      pubkey
      recipient
      owner
      status
      createdAt
    }
  }
`;

const fetchOverview = async (chainId?: number) => {
  if (!chainId || !baseGraphUrl?.[chainId.toString()]) return undefined;

  const perpetualClient = new GraphQLClient(baseGraphUrl?.[chainId.toString()], {
    headers: {},
  });

  // const data: any = await perpetualClient.request(userTxs);
  // return data?.histories?.filter((i) => i.action === 'Lock');
  const data: any = await perpetualClient.request(sequencerFilter);
  const reorgData: any[] = [];
  data?.sequencers?.forEach(seq => {
    reorgData.push({
      id: seq.id,
      action: 'Lock',
      amount: seq.locked,
      timestamp: seq.createdAt,
      sequencer: {
        address: seq.address,
        id: seq.id,
        status: seq.status,
        pubkey: seq.pubkey,
        owner: seq.owner,
        totalReward: seq.totalReward,
        claimed: seq.claimed,
        recipient: seq.recipient,
      },
    });
  });
  return reorgData;
};

export default fetchOverview;
