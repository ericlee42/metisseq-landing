import { graphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

const userTxs = gql`
  query MyQuery($address: String) {
    epoches(first: 25, orderDirection: desc, orderBy: endBlock, where: { signer: $address }) {
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

const fetchBlock = async (address: string, chainId: string | number, current?: any, pageSize?: any) => {
  if (!address || !chainId) return null;

  const perpetualClient = new GraphQLClient(graphUrl.block[chainId?.toString()], {
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

  return data;
};

export default fetchBlock;
