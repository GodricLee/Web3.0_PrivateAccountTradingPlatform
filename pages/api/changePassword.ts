// pages/api/changePassword.ts
import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';

interface ChangePasswordRequest extends NextApiRequest {
    body: {
        newPassword: string;
    };
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

export default async function handler(req: ChangePasswordRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        // 使用 Moralis 调用智能合约的 `buyer_confirm_password_changed` 方法
        const tradeKey = 'CURRENT_TRADE_KEY'; // 需要替换为实际的 tradeKey
        const contractAddress = '0x4fb5Ff0C3b34C3aeB69C768D002277C7c72062E8'; // 替换为实际合约地址
        const abi = [
            {
                inputs: [
                    { internalType: 'string', name: 'new_key', type: 'string' },
                    { internalType: 'address', name: 'requester_address', type: 'address' },
                ],
                name: 'buyer_confirm_password_changed',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];

        await Moralis.start({ apiKey: 'YOUR_MORALIS_API_KEY' });//改成实际的apikey

        const options = {
            address: contractAddress,
            functionName: 'buyer_confirm_password_changed',
            abi,
            params: {
                new_key: tradeKey,
                requester_address: 'BUYER_ADDRESS', // 替换为买家的地址
            },
        };

        const result = await Moralis.EvmApi.utils.runContractFunction(options);

        return res.status(200).json({ message: 'Password changed and trade step updated', result });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to change password and update trade step', error: error.message });
    }
}
