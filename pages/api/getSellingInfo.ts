import Moralis from 'moralis';
import { CommonSolUtilsConfigSetup } from 'moralis/common-sol-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import speakeasy from 'speakeasy';

interface RequestBody extends NextApiRequest {
    sellerAddress: string;
}

interface TradeInfo {
    buyer_address: string;
    seller_address: string;
    trade_key: string;
    trade_status: string;
    trade_amount: string;
    trade_creation_time: string;
    trade_end_time: string;
}

interface ResponseBody {
    tradeInfos: TradeInfo[];
}

export default async function handler(req: RequestBody, res: NextApiResponse<ResponseBody | { message: string; error?: string }>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { sellerAddress }: RequestBody = req.body;

        if (!sellerAddress) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        if (!Moralis.Core.isStarted) {
            await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });
        }

        const response = await Moralis.EvmApi.utils.runContractFunction({
            chain: '0xa4b1', // 替换为链 ID
            address: process.env.CONTRACT_ADDRESS || '', // 替换为合约地址
            functionName: 'get_trades_by_address_as_seller',
            abi: process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
            params: {
                account_address: sellerAddress,
            },
        });

        const tradeKeys = response.result as unknown as string[];

        if (tradeKeys.length === 0) {
            return res.status(404).json({ message: 'No trades found' });
        }

        const tradeInfos: TradeInfo[] = await Promise.all(tradeKeys.map(async (tradeKey) => {
            const tradeInfoResponse = await Moralis.EvmApi.utils.runContractFunction({
                chain: '0xa4b1',
                address: process.env.CONTRACT_ADDRESS || '',
                functionName: 'get_trade_basic_info_by_key',
                abi: process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [],
                params: {
                    new_key: tradeKey,
                    requester_address: sellerAddress,
                },
            });

            const [buyerAddress, sellerAddressRes, tradeAmount, tradeCreationTime, tradeEndTime, tradeStep] = Object.values(tradeInfoResponse.result);

            let tradeStatus: string;
            switch (tradeStep.toString()) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                    tradeStatus = 'In Progress';
                    break;
                case '5':
                    tradeStatus = 'Cancelled';
                    break;
                case '10':
                    tradeStatus = 'Completed';
                    break;
                default:
                    tradeStatus = 'Unknown';
            }

            return {
                buyer_address: buyerAddress,
                seller_address: sellerAddressRes,
                trade_key: tradeKey,
                trade_status: tradeStatus.toString(),
                trade_amount: tradeAmount.toString(),
                trade_creation_time: tradeCreationTime.toString(),
                trade_end_time: tradeEndTime.toString(),
            };
        }));

        return res.status(200).json({ tradeInfos });

    } catch (error: any) {
        return res.status(500).json({ message: 'Failed', error: error.message });
    }
}