import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import speakeasy from 'speakeasy';

interface RequestBody extends NextApiRequest {
    tradeKey: string;
    buyerAddress: string;
}

interface AccountInfo {
    login_url: string;
    account_username: string;
    account_password: string;
    two_fa_key: string;
  }

interface ResponseBody {
    accountInfo: AccountInfo;
}

export default async function handler(req: RequestBody, res: NextApiResponse<ResponseBody | { message: string; error?: string }>

) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, buyerAddress }: RequestBody = req.body;

        if (!tradeKey || !buyerAddress) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        if (!Moralis.Core.isStarted) {
            await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });
          }
      
          const response = await Moralis.EvmApi.utils.runContractFunction({
            chain: '0xa4b1', // 替换为链 ID
            address: process.env.CONTRACT_ADDRESS || '', // 替换为合约地址
            functionName: 'buyer_request_2FA',
            abi: process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
            params: {
                new_key: tradeKey,
                requester_address: buyerAddress,
            },
          });
        
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to retrieve 2FA key', error: error.message });
    }
}

