// pages/api/createTrade.ts
import Moralis from 'moralis';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 1. 创建一个日志函数
const logToFile = (message: string) => {
    const logFilePath = path.join(process.cwd(), 'log.txt');  // 'process.cwd()' 获取当前工作目录，即项目根目录
    const logMessage = `${new Date().toISOString()} - ${message}\n`;  // 添加时间戳到日志消息
    fs.appendFileSync(logFilePath, logMessage, 'utf8');  // 以 UTF-8 编码追加写入日志
};

interface TradeRequestBody {
    tradeKey: string;
    buyerAddress: string;
    sellerAddress: string;
    tradeAmount: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        logToFile('Invalid request method');  // 记录日志
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeKey, buyerAddress, sellerAddress, tradeAmount }: TradeRequestBody = req.body;

        // 2. 初始化 Moralis 并记录日志
        logToFile(`Initializing Moralis with API key: ${process.env.MORALIS_API_KEY}`);
        if (!Moralis.Core.isStarted) {
            await Moralis.start({ apiKey: process.env.MORALIS_API_KEY || '' });
        }

        // Smart contract details
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            logToFile('CONTRACT_ADDRESS environment variable is not set');
            throw new Error('CONTRACT_ADDRESS environment variable is not set');
        }

        const abi = process.env.CONTRACT_ABI ? JSON.parse(process.env.CONTRACT_ABI) : [];
        if (!abi || abi.length === 0) {
            logToFile('Invalid or missing contract ABI');
            throw new Error('Invalid or missing contract ABI');
        }

        logToFile('Interacting with the smart contract');
        // not backend account
        // Interact with the smart contract
        // const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        // const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
        // const contract = new ethers.Contract(contractAddress, abi, signer);
        // const parsedTradeAmount = ethers.utils.parseUnits(tradeAmount, 'ether');

        // const { ethereum } = window;
        // if (!ethereum) {
        //     logToFile('Ethereum object is not available');
        //     return res.status(400).json({ message: 'Ethereum object is not available' });
        // }
        // const provider = new ethers.providers.Web3Provider(ethereum as unknown as ethers.providers.ExternalProvider);
        // const signer = provider.getSigner();
        // const contract = new ethers.Contract(contractAddress, abi, signer);
        // if (!tradeAmount || isNaN(parseFloat(tradeAmount))) {
        //     logToFile(`Invalid trade amount: ${tradeAmount}`);
        //     return res.status(400).json({ message: 'Invalid trade amount' });
        // }
        // const network = await provider.getNetwork();
        // console.log(network);
        // if (!ethers.utils.isAddress(buyerAddress)) {
        //     logToFile(`Invalid buyer address: ${buyerAddress}`);
        //     return res.status(400).json({ message: 'Invalid buyer address' });
        // }
        
        // if (!ethers.utils.isAddress(sellerAddress)) {
        //     logToFile(`Invalid seller address: ${sellerAddress}`);
        //     return res.status(400).json({ message: 'Invalid seller address' });
        // }

        // logToFile('Interacting with the smart contract on step 2');
        // const tx = await contract.createTrade(
        //     tradeKey,
        //     buyerAddress,
        //     sellerAddress,
        //     tradeAmount,
        //     // { gasLimit: ethers.BigNumber.from("3000000") ,
        //     //     maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'), // 设置合理的 maxFeePerGas
        //     //     maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'), // 设置合理的 maxPriorityFeePerGas
                

        //     // }
        // );

        // const receipt = await tx.wait();
        // logToFile(`Transaction Hash: ${receipt.transactionHash}`);  // 记录成功的交易哈希

        return res.status(200).json({ message: 'Trade created successfully' });

    } catch (error: any) {
        logToFile(`Error: ${error.message}`);  // 记录错误信息
        return res.status(500).json({ message: error.message });
    }
}
