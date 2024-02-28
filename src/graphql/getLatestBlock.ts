// todo
import { graphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

const blocks = gql`
  query MyQuery($from: String, $to: String) {
    blocks(first: 1, orderDirection: desc, orderBy: number) {
      number
      timestamp
    }
  }
`;

const fetchLatestBlockTimestamp = async (chainId: string | number) => {
  const perpetualClient = new GraphQLClient(graphUrl.block[chainId.toString()], {
    headers: {},
  });
  const blockData: any = await perpetualClient.request(blocks);

  //   const timestamp = blockData?.blocks?.[0]?.timestamp;

  return blockData?.blocks?.[0];
};

export default fetchLatestBlockTimestamp;
