// pages/api/getServiceFee.ts
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
interface ServiceFeeRequest extends NextApiRequest {
    body: {
        tradeAmount: string;
    };
}

interface ServiceFeeResponse {
    serviceFee: string;
}

export default async function handler(
    req: ServiceFeeRequest,
    res: NextApiResponse<ServiceFeeResponse | { message: string; error?: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeAmount } = req.body;

        // Calculate or retrieve the service fee from the backend logic
        const serviceFeePercentage = 1; // 这里假设服务费是 1%，这里可以自由调整
        const serviceFee = (parseFloat(tradeAmount) * serviceFeePercentage) / 100;

        // Convert service fee to Wei (backend assumes tradeAmount is in ETH)
        const serviceFeeInWei = ethers.utils.parseUnits(serviceFee.toString(), 'ether');

        return res.status(200).json({ serviceFee: serviceFeeInWei.toString() });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to calculate service fee', error: error.message });
    }
}
  