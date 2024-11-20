// /api/getTradeStep.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
import { useSession } from 'next-auth/react';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // const { data } = useSession();
  // const address = data?.user?.address;
  const { tradeKey } = req.body;

  if (!tradeKey) {
    return res.status(400).json({ error: 'Trade key is required.' });
  }

  try {
    // 初始化 Moralis
    if (!Moralis.Core.isStarted) {
      await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });
    }

    // 调用智能合约 get_current_step 方法
    const step = await Moralis.EvmApi.utils.runContractFunction({
      chain: '0xa4b1', // 替换为链 ID
      address: process.env.CONTRACT_ADDRESS || '', // 替换为合约地址
      functionName: 'get_current_step',
      abi: process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
      params: {
        new_key: '114514',
        requester_address: '0xeE7e2c107AbC589Da98f642829054928AeD9FEf5', // 替换为用户地址
      },
    });

    // 返回步骤到前端
    res.status(200).json({ step });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
  return null;
}
