import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';

interface WithdrawFundsRequest extends NextApiRequest {
    body: {
        tradeKey: string;
        sellerAddress: string;
    };
}

interface WithdrawFundsResponse extends NextApiResponse {
    json: (body: { message: string; transactionHash?: string; error?: string }) => void;
}

export default async function handler(req: WithdrawFundsRequest, res: WithdrawFundsResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, sellerAddress } = req.body;

        if (!tradeKey || !sellerAddress) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Initialize Moralis
        await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || ''  });

        // Smart contract configuration
        const contractAddress = process.env.CONTRACT_ADDRESS || ''; // Replace with your contract address
        const abi = [
            {
                inputs: [
                    { internalType: 'string', name: 'new_key', type: 'string' },
                    { internalType: 'address', name: 'requester_address', type: 'address' },
                ],
                name: 'seller_withdraw_funds',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];

        const options = {
            address: contractAddress,
            functionName: 'seller_withdraw_funds',
            abi,
            params: {
                new_key: tradeKey,
                requester_address: sellerAddress,
            },
        };

        const result = await Moralis.EvmApi.utils.runContractFunction(options);

        return res.status(200).json({
            message: 'Funds withdrawn successfully',
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to withdraw funds', error: error.message });
    }
}
