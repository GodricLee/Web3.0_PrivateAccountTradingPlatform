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
        if (!Moralis.Core.isStarted) {
            await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });
        }
        // Smart contract details
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error('CONTRACT_ADDRESS environment variable is not set');
        }
        const abi = process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [];

        // Interact with the smart contract
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Call the smart contract function
        const transaction = await contract.createTrade(
            tradeKey,
            buyerAddress,
            sellerAddress,
            ethers.BigNumber.from(tradeAmount).add(ethers.BigNumber.from(serviceFee)).toString()
        );

        await transaction.wait();

        return res.status(200).json({ transaction });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to create trade', error: error.message });
    }
}
