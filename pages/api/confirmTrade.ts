import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';

interface ConfirmTradeRequest extends NextApiRequest {
    body: {
        tradeKey: string;
        buyerAddress: string;
    };
}

interface ConfirmTradeResponse {
    message: string;
    transactionHash?: string;
    error?: string;
}

export default async function handler(req: ConfirmTradeRequest, res: NextApiResponse<ConfirmTradeResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, buyerAddress } = req.body;

        if (!tradeKey || !buyerAddress) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Initialize Moralis
        await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });

        // Smart contract configuration
        const contractAddress = process.env.CONTRACT_ADDRESS || ''; 
        const abi = [
            {
                inputs: [
                    { internalType: 'string', name: 'new_key', type: 'string' },
                    { internalType: 'address', name: 'requester_address', type: 'address' },
                ],
                name: 'buyer_confirm_trade',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];

        // Call the smart contract function
        const options = {
            address: contractAddress,
            functionName: 'buyer_confirm_trade',
            abi,
            params: {
                new_key: tradeKey,
                requester_address: buyerAddress,
            },
        };

        const result = await Moralis.EvmApi.utils.runContractFunction(options);

        return res.status(200).json({
            message: 'Trade confirmed successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to confirm trade', error: (error as Error).message });
    }
}
