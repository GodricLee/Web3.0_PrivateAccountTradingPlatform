import { useState } from 'react';
import { VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
const FundUpload = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { tradeKey } = router.query; // 从 URL 查询参数中获取 tradeKey
  const { data } = useSession();
  const buyerAddress = data?.user?.address;
  
  const handleUploadFund = async () => {
    if (!amount) {
      toast({
        title: 'Error',
        description: 'Please enter the amount to upload.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/uploadFund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey,amount,buyerAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload fund.');
      }

      toast({
        title: 'Success',
        description: 'Fund uploaded successfully!',
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
      <Heading size="lg">Upload Fund</Heading>
      <Input
        placeholder="Enter amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button colorScheme="blue" onClick={handleUploadFund} isLoading={loading}>
        Upload Fund
      </Button>
    </VStack>
  );
};

export default FundUpload;
