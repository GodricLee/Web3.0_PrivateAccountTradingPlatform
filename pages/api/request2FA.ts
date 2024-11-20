import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
    tradeKey: string;
    buyerAddress: string;
}

interface MoralisOptions {
    contractAddress: string;
    functionName: string;
    abi: any[];
    params: {
        new_key: string;
        requester_address: string;
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, buyerAddress }: RequestBody = req.body;

        if (!tradeKey || !buyerAddress) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Initialize Moralis
        await Moralis.start({ apiKey: 'YOUR_MORALIS_API_KEY' });

        // Smart contract configuration
        const contractAddress = '0xYourContractAddress'; // Replace with your contract address
        const abi = [
            {
                inputs: [
                    { internalType: 'string', name: 'new_key', type: 'string' },
                    { internalType: 'address', name: 'requester_address', type: 'address' },
                ],
                name: 'buyer_request_2FA',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
        ];

        // Call the smart contract function
        const options = {
            address: contractAddress,
            contractAddress,
            functionName: 'buyer_request_2FA',
            abi,
            params: {
                new_key: tradeKey,
                requester_address: buyerAddress,
            },
        };

        const twoFaKey = await Moralis.EvmApi.utils.runContractFunction(options);

        return res.status(200).json({
            message: '2FA key retrieved successfully',
            twoFaKey,
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to retrieve 2FA key', error: error.message });
    }
}
