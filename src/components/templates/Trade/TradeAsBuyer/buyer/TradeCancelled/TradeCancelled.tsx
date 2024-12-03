import { VStack, Heading, Text, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const TradeCancelled = () => {
  const toast = useToast();
  const router = useRouter();
  const { tradeKey } = router.query;
  const { data } = useSession();
  const buyerAddress = data?.user?.address;

  if (typeof window === 'undefined') {
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
      const tx = await contract.buyer_funds_returned(tradeKey as string, buyerAddress as string);

      await tx.wait();

      toast({
        title: 'Funds Returned',
        description: 'Your funds have been successfully returned.',
        status: 'success',
        duration: 3000,
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
    }
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg" textAlign="center">
        Trade Cancelled
      </Heading>
      <Text fontSize="xl">
        Your trade has been cancelled.
        <br />
        If you wish to continue, consider initializing a new trade.
      </Text>
      <Text fontSize="md">Click the button below to retrieve your funds.</Text>
      <Button colorScheme="green" onClick={handleWithdrawFunds}>
        Withdraw Funds
      </Button>
    </VStack>
  );
};

export default TradeCancelled;
