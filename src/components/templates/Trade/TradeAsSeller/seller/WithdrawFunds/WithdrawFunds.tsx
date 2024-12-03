import {
  VStack,
  Heading,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';


const WithdrawFunds = () => {
  const toast = useToast();
  const router = useRouter();
  const { tradeKey } = router.query; // 从 URL 查询参数中获取 tradeKey
  const { data } = useSession();
  const sellerAddress = data?.user?.address;

  if (typeof window === 'undefined') {
    // 如果是服务器端渲染，返回空，避免错误
    return null;
  }

  const handleWithdrawFunds = async () => {
    try {
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
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI
        ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI)
        : [];

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.seller_withdraw_funds(tradeKey as string, sellerAddress as string);

      await tx.wait();

      toast({
        title: 'Funds Withdrawn',
        description: 'Your funds have been successfully withdrawn.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push(`/trade/seller/TradeComplete?tradeKey=${tradeKey}`); // 跳转到交易完成页面
      
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg" textAlign="center" color="teal.500">
        Congratulations! The trade has successfully concluded.
        <br />
        You can now withdraw your funds.
      </Heading>
      <Button colorScheme="green" onClick={handleWithdrawFunds}>
        Withdraw Funds
      </Button>
    </VStack>
  );
    
  }



export default WithdrawFunds;
