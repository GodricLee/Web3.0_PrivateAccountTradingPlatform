import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

interface UploadFundRequest extends NextApiRequest {
    body: {
        tradeKey: string;
        amount: string;
        buyerAddress: string;
    };
}

interface UploadFundResponse {
    message: string;
    transactionHash?: string;
    error?: string;
}

export default async function handler(req: UploadFundRequest, res: NextApiResponse<UploadFundResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, amount, buyerAddress } = req.body;

        if (!tradeKey || !amount || !buyerAddress) {
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
                name: 'buyer_upload_fund',
                outputs: [],
                stateMutability: 'payable',
                type: 'function',
            },
        ];


        const amountInWei = ethers.utils.parseUnits(amount.toString(), 'ether');
        // Call the smart contract function
        const options = {
            address: contractAddress,
            contractAddress,
            functionName: 'buyer_upload_fund',
            abi,
            params: {
                new_key: tradeKey,
                requester_address: buyerAddress,
            },
            msgValue: amountInWei, // Send ETH along with the transaction
        };

        const result = await Moralis.EvmApi.utils.runContractFunction(options);

        return res.status(200).json({
            message: 'Funds uploaded successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to upload funds', error: (error as Error).message });
    }
}
