import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

interface RequestBody extends NextApiRequest {
    tradeKey: string;
    buyerAddress: string;
}



export default async function handler(req: RequestBody, res: NextApiResponse<{ message: string; error?: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, buyerAddress }: RequestBody = req.body;

        if (!tradeKey || !buyerAddress) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS || '',
            process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
            signer
        );
        await contract.step_plus_after_buyer_request_2FA(tradeKey, buyerAddress);
        return res.status(200).json({ message: 'Proceed Successfully' });
        
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to proceed', error: error.message });
    }
}
