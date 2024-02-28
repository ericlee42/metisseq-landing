// todo
import { graphUrl } from '@/configs/common';
import { gql, GraphQLClient } from 'graphql-request';

// "add1": "0xfe08ee83b1f01d6d7c6eff3c8c84fa6fe02fca17",
// "add2": "0x1267397fb5bf6f6dcc3d18d673616d512dbcd8f0",
// "add3": "0x3eb630c3c267395fee216b603a02061330d39642",

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
