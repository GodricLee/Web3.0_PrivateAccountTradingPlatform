// /api/getTradeStep.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tradeKey } = req.body;

  if (!tradeKey) {
    return res.status(400).json({ error: 'Trade key is required.' });
  }

  try {
    // 初始化 Moralis
    await Moralis.start({ apiKey: 'YOUR_API_KEY' });

    // 调用智能合约 get_current_step 方法
    const step = await Moralis.EvmApi.utils.runContractFunction({
      chain: 'CHAIN_ID', // 替换为链 ID
      address: 'YOUR_CONTRACT_ADDRESS', // 替换为合约地址
      functionName: 'get_current_step',
      abi: [
        {
          inputs: [
            { internalType: 'string', name: 'new_key', type: 'string' },
            { internalType: 'address', name: 'requester_address', type: 'address' },
          ],
          name: 'get_current_step',
          outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      params: {
        new_key: tradeKey,
        requester_address: 'REQUESTER_ADDRESS', // 替换为用户地址
      },
    });

    // 返回步骤到前端
    res.status(200).json({ step });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
  return res.status(405).json({ error: 'unknowed error' });
}
