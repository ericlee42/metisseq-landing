import { graphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

const userTxs = gql`
  query MyQuery($address: String) {
    epoches(first: 5, orderDirection: desc, orderBy: id, where: { signer: $address }) {
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

const blocks = gql`
  query MyQuery($from: String, $to: String) {
    blocks(first: 1, orderDirection: desc, orderBy: number, where: { number_gte: $from, number_lte: $to }) {
      number
      timestamp
    }
  }
`;

const fetchBatchBlockTx = async (address: string, chainId: string | number) => {
  if (!address) return null;

  const perpetualClient = new GraphQLClient(graphUrl.block[chainId?.toString()], {
    headers: {},
  });

  const _address = address.toString().toLowerCase();
  const txData: any = await perpetualClient.request(userTxs, {
    address: _address,
  });

  const startBlock = txData?.epoches?.[txData?.epoches?.length - 1]?.startBlock;
  const endBlock = txData?.epoches?.[0]?.endBlock;
  if (!endBlock || !startBlock) return undefined;

  const blockData: any = await perpetualClient.request(blocks, {
    from: startBlock,
    to: endBlock,
  });

  const timestamp = blockData?.blocks?.[0]?.timestamp;

  return { timestamp, producingBlocks: txData?.epoches };
};

export default fetchBatchBlockTx;
