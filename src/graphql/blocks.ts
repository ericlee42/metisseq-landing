import { graphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

const userTxs = gql`
  query MyQuery($address: String, $skip: Int, $first: Int) {
    epoches(first: $first, skip: $skip, orderDirection: desc, orderBy: endBlock, where: { signer: $address }) {
      id
      startBlock
      endBlock
      signer
      transaction
      recommited
      block
      blockTimestamp
    }
  }
`;

const fetchBlock = async (address: string, chainId: string | number, skip?: number, first?: number) => {
  if (!address || !chainId) return null;

  const perpetualClient = new GraphQLClient(graphUrl.block[chainId?.toString()], {
    headers: {},
  });
  const _address = address.toString().toLowerCase();
  const data: any = await perpetualClient.request(userTxs, {
    address: _address,
    skip: skip || 0,
    first: 6 * 10, // for 6 pages
  });

  return data;
};

export default fetchBlock;
