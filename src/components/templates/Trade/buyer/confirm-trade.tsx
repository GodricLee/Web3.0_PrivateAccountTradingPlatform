import { VStack, Heading, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
const { data } = useSession();
const address = data?.user?.address;

const ConfirmTrade = () => {
  const router = useRouter();
  const { tradeKey } = router.query; // 从 URL 查询参数中获取 tradeKey
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleConfirmTrade = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/confirmTrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey, buyerAddress:address }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm trade.');
      }

      toast({
        title: 'Trade Confirmed',
        description: 'The trade has been confirmed successfully!',
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Confirm Trade</Heading>
      <Button colorScheme="green" onClick={handleConfirmTrade} isLoading={loading}>
        Confirm Trade
      </Button>
    </VStack>
  );
};

export default ConfirmTrade;
