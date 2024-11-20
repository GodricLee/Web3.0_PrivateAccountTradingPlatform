// pages/api/createTrade.ts
import Moralis from 'moralis';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

interface TradeRequestBody {
    tradeKey: string;
    buyerAddress: string;
    sellerAddress: string;
    tradeAmount: string;
    serviceFee: string;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, buyerAddress, sellerAddress, tradeAmount, serviceFee }: TradeRequestBody = req.body;

        // Initialize Moralis
        await Moralis.start({ apiKey: 'YOUR_MORALIS_API_KEY' });

        // Smart contract details
        const contractAddress = '0xYourContractAddress'; // Replace with your deployed contract address
        const abi = [
            {
                inputs: [
                    { internalType: 'string', name: 'new_key', type: 'string' },
                    { internalType: 'address', name: 'buyer_address', type: 'address' },
                    { internalType: 'address', name: 'seller_address', type: 'address' },
                    { internalType: 'uint256', name: 'trade_amount', type: 'uint256' },
                ],
                name: 'createTrade',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];

        // Interact with the smart contract
        const options = {
            address: contractAddress,
            functionName: 'createTrade',
            abi,
            params: {
                new_key: tradeKey,
                buyer_address: buyerAddress,
                seller_address: sellerAddress,
                trade_amount: ethers.BigNumber.from(tradeAmount).add(ethers.BigNumber.from(serviceFee)).toString(),
            },
        };

        // Call the smart contract function
        const transaction = await Moralis.EvmApi.utils.runContractFunction(options);

        return res.status(200).json({ transaction });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to create trade', error: error.message });
    }
}
