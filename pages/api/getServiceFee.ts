// pages/api/getServiceFee.ts
import Moralis from 'moralis';
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
interface ServiceFeeRequest extends NextApiRequest {
    body: {
        requester_address: string;
    };
}

interface ServiceFeeResponse {
    serviceFee: string;
}

export default async function handler(
    req: ServiceFeeRequest,
    res: NextApiResponse<ServiceFeeResponse | { message: string; error?: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { requester_address } = req.body;

        if (!requester_address) {
            return res.status(400).json({ message: 'Requester address is required' });
        }

        if (!Moralis.Core.isStarted) {
            await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });
          }
      
          const response = await Moralis.EvmApi.utils.runContractFunction({
            chain: '0xa4b1', // 替换为链 ID
            address: process.env.CONTRACT_ADDRESS || '', // 替换为合约地址
            functionName: 'get_service_fee',
            abi: process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
            // params: {
            // },
          });
          const serviceFee = response.result as string;
          return res.status(200).json({ serviceFee });

    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to calculate service fee', error: error.message });
    }
}
  