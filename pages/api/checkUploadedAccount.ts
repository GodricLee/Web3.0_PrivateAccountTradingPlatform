import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

interface RequestBody extends NextApiRequest {
    tradeKey: string;
    buyerAddress: string;
}

interface ResponseBody {
    uploadedaccount: number;
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
            functionName: 'check_if_seller_uploaded_information',
            abi: process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
            params: {
                new_key: tradeKey,
                requester_address: buyerAddress,
            },
          });
        const uploaded_account = response.result as unknown as boolean;
        const uploadedaccount = uploaded_account ? 1 : 0;
        
        return res.status(200).json({ uploadedaccount });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error checking if seller has uploaded account', error: error.message });
    }
}
