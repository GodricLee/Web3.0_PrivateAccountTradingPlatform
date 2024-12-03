import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

interface RequestBody extends NextApiRequest {
    tradeKey: string;
    buyerAddress: string;
}

interface ResponseBody {
    auto_confirmed: number;
}

export default async function handler(req: RequestBody, res: NextApiResponse<ResponseBody | { message: string; error?: string }>

) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, buyerAddress }: RequestBody = req.body;

        if (!tradeKey || !buyerAddress) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        if (!Moralis.Core.isStarted) {
            await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });
          }
      
          const response = await Moralis.EvmApi.utils.runContractFunction({
            chain: '0xa4b1', // 替换为链 ID
            address: process.env.CONTRACT_ADDRESS || '', // 替换为合约地址
            functionName: 'is_30_minutes_passed',
            abi: process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
            params: {
                new_key: tradeKey,
                requester_address: buyerAddress,
            },
          });
        const is_time_passed = response.result as unknown as boolean;
        console.log("is_time_passed", is_time_passed);
        const auto_confirmed = is_time_passed ? 1 : 0;
        if(auto_confirmed === 1){

            //TO DO: Use ethers.js to call the non-view function set_bool_after_buyer_request_2FA in the smart contract

            //END TO DO
            const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

            const contract = new ethers.Contract(
                process.env.CONTRACT_ADDRESS || '',
                process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
                signer
            );

            await contract.buyer_confirm_password_changed(tradeKey, buyerAddress);
     }
        return res.status(200).json({ auto_confirmed });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching auto_confirmed.', error: error.message });
    }
}
