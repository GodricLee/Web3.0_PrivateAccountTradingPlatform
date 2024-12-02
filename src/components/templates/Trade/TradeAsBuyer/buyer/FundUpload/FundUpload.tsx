import { useState } from 'react';
import { VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ethers } from 'ethers';

const FundUpload = () => {
  if (typeof window === 'undefined') {
    // 如果是服务器端渲染，返回空，避免错误
    return null;
  }
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { tradeKey } = router.query; // 从 URL 查询参数中获取 tradeKey
  const { data } = useSession();
  const buyerAddress = data?.user?.address;
  const [walletAddress, tradeamount, role, seed] = tradeKey ? atob(tradeKey as string).split(':') : ['', '', '', ''];
  
  const handleUploadFund = async () => {
    

    try {
      setLoading(true);

      const { ethereum } = window;
      if (!ethereum) {
        toast({
          title: 'MetaMask Not Found',
          description: 'Please install MetaMask and connect your wallet.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }


      const provider = new ethers.providers.Web3Provider(ethereum as any);
      const signer = provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
      
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI) : [] as any;  // 请确保你在 .env 中有合约 ABI
  
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tradeAmount_ = ethers.utils.parseUnits(tradeamount, 'ether'); // Convert amount to Wei
  
      
      const serviceFee = await fetchServiceFee(buyerAddress);
      const serviceFeeBigNumber = ethers.BigNumber.from(serviceFee);
      const serviceFeeAmount = serviceFeeBigNumber.add(ethers.BigNumber.from(100));
      const stepAmount = tradeAmount_.mul(serviceFeeAmount);
      const totalAmount = stepAmount.div(ethers.BigNumber.from(100));

      // toast({
      //   title: 'TEST',
      //   description: `tradeAmount:${tradeAmount_} serviceFee:${serviceFee} serviceFeeAmount:${serviceFeeAmount} serviceFeeAmount:${serviceFeeAmount} stepAmount:${stepAmount} totalAmount:${totalAmount}`,
      //   status: 'success',
      //   duration: 5000,
      //   isClosable: true,
      // });

      const tx = await contract.buyer_upload_fund(tradeKey, buyerAddress, { value: totalAmount });

      const receipt = await tx.wait();
      toast({
        title: 'Fund uploaded successfully!',
        description: `Transaction hash: ${receipt.transactionHash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });


      
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceFee = async (address: string) => {
    const feeResponse = await fetch('/api/getServiceFee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requester_address: address }),
    });

    if (!feeResponse.ok) {
      const errorResponse = await feeResponse.json();
      throw new Error(errorResponse.error ||'Failed to fetch service fee');
    }

    const { serviceFee } = await feeResponse.json();
    if (!serviceFee) {
      throw new Error('Service fee not provided by backend');
    }
    return serviceFee;
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Upload Fund</Heading>
      <Heading size="md">Amount: {tradeamount} ETH (ServiceFee Not Included)</Heading>
      <Button colorScheme="blue" onClick={handleUploadFund} isLoading={loading}>
      Upload Fund
      </Button>
    </VStack>
  );
};

export default FundUpload;
