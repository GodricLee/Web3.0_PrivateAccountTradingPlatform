import { useState, useEffect } from 'react';
import { VStack, Heading, Text, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ethers } from 'ethers';

const PasswordChange = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const router = useRouter();
  const { tradeKey } = router.query;
  const { data } = useSession();
  const buyerAddress = data?.user?.address;

  const [autoConfirmed, setAutoConfirmed] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    const checkAutoConfirmed = async () => {
      try {
        const response = await fetch('/api/changePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tradeKey, buyerAddress }),
        });
        const result = await response.json();
        const { auto_confirmed } = result;
        if (auto_confirmed === 1) {
          toast({
            title: '30 minutes have passed, the trade has automatically ended.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          router.push(`/trade/buyer/TradeComplete?tradeKey=${tradeKey}`);
        } else {
          setAutoConfirmed(0);
        }
      } catch (error) {
        console.error('Error fetching auto_confirmed:', error);
      }
    };

    checkAutoConfirmed();
  }, [router, toast, tradeKey]);

  const handleConfirmClick = async () => {
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
      
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI) : [] as any;  // 请确保你在 .env 中有合约 ABI
  
      const contract = new ethers.Contract(contractAddress, abi, signer);


      const tx = await contract.buyer_confirm_password_changed(tradeKey, buyerAddress);
      await tx.wait();

      toast({
        title: 'Trade confirmed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push(`/trade/buyer/TradeComplete?tradeKey=${tradeKey}`);
    } catch (error) {
      console.error('Error confirming password change:', error);
      toast({
        title: 'Error confirming trade.',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (autoConfirmed === null) {
    return null;
  }

  return (
    <VStack spacing={6} align="stretch" p={8}>
      <Heading as="h2" size="lg">
        Trade Confirmation
      </Heading>
      <Text fontSize="md">
        If you have changed the password, please confirm that the trade is complete. The trade will automatically end 30 minutes after you clicked "Confirm Trade" in the previous step. Once the trade is over, the funds will be sent to the seller's account.
      </Text>
      <Button colorScheme="teal" size="lg" onClick={handleConfirmClick}>
        I have changed the password, confirm trade completion
      </Button>
    </VStack>
  );
};

export default PasswordChange;
