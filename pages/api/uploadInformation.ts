import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';

interface UploadInformationRequest extends NextApiRequest {
    body: {
        tradeKey: string;
        sellerAddress: string;
        loginUrl: string;
        username: string;
        password: string;
        twoFaKey: string;
    };
}

interface UploadInformationResponse extends NextApiResponse {
    json: (body: { message: string; transactionHash?: string; error?: string }) => void;
}

export default async function handler(req: UploadInformationRequest, res: UploadInformationResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, sellerAddress, loginUrl, username, password, twoFaKey } = req.body;

        if (!tradeKey || !sellerAddress || !loginUrl || !username || !password || !twoFaKey) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Initialize Moralis
        await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });

        // Smart contract configuration
        const contractAddress = process.env.CONTRACT_ADDRESS || ''; // Replace with your contract address
        const abi = [
            {
                inputs: [
                    { internalType: 'string', name: 'new_key', type: 'string' },
                    { internalType: 'address', name: 'requester_address', type: 'address' },
                    { internalType: 'string', name: 'login_url', type: 'string' },
                    { internalType: 'string', name: 'account_username', type: 'string' },
                    { internalType: 'string', name: 'account_password', type: 'string' },
                    { internalType: 'string', name: 'two_fa_key', type: 'string' },
                ],
                name: 'seller_upload_information',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];

        const options = {
            address: contractAddress,
            functionName: 'seller_upload_information',
            abi,
            params: {
                new_key: tradeKey,
                requester_address: sellerAddress,
                login_url: loginUrl,
                account_username: username,
                account_password: password,
                two_fa_key: twoFaKey,
            },
        };

        const result = await Moralis.EvmApi.utils.runContractFunction(options);

        return res.status(200).json({
            message: 'Account information uploaded successfully',
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to upload account information', error: error.message });
    }
}
