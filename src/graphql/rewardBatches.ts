import { baseGraphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

const rewardBatchesWithEpoch = gql`
  query rewardBatchesWithEpoch($curEpoch: BigInt) {
    rewardBatches {
      endEpoch
      rpb
      id
      startEpoch
      timestamp
      total
    }
  }
`;

const rewardBatches = gql`
  query rewardBatches {
    rewardBatches {
      endEpoch
      rpb
      id
      startEpoch
      timestamp
      total
    }
  }
`;

const fetchrewardBatchesWithEpoch = async (curEpoch: string, chainId: number) => {
  if (!chainId || !baseGraphUrl?.[chainId.toString()]) throw new Error('Invalid Client');
  const perpetualClient = new GraphQLClient(baseGraphUrl?.[chainId.toString()], {
    headers: {},
  });

  const data: any = await perpetualClient.request(rewardBatchesWithEpoch, {
    curEpoch: +curEpoch,
  });
  return data;
};

const fetchrewardBatches = async (chainId: number) => {
  if (!chainId || !baseGraphUrl?.[chainId.toString()]) throw new Error('Invalid Client');
  const perpetualClient = new GraphQLClient(baseGraphUrl?.[chainId.toString()], {
    headers: {},
  });

  const data: any = await perpetualClient.request(rewardBatches);
  return data;
};

export { fetchrewardBatchesWithEpoch, fetchrewardBatches };
