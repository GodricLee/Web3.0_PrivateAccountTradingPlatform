import { VStack, Heading, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const router = useRouter();
const { tradeKey } = router.query; // 从 URL 查询参数中获取 tradeKey
const { data } = useSession();
const sellerAddress = data?.user?.address;

const WithdrawFunds = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleWithdraw = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/withdrawFunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey, sellerAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw funds.');
      }

      const { transactionHash } = await response.json();

      toast({
        title: 'Success',
        description: `Funds withdrawn successfully. Transaction hash: ${transactionHash}`,
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

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Withdraw Funds</Heading>
      <Button colorScheme="green" onClick={handleWithdraw} isLoading={loading}>
        Withdraw Funds
      </Button>
    </VStack>
  );
};

export default WithdrawFunds;
