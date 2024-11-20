import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const TradeAsSeller = () => {
  const [tradeKey, setTradeKey] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { data } = useSession();
  const address = data?.user?.address;
  const handleSubmit = async () => {
    if (!tradeKey) {
      toast({
        title: 'Error',
        description: 'Please enter the trade key.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      // 调用服务器 API 查询交易状态
      const response = await fetch('/api/getTradeStep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey, address }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to fetch trade step from server.');
      }

      const { step } = await response.json();
      const stepInt = parseInt(step, 10);
      // 根据返回的 step 值进行页面跳转
      switch (stepInt) {
        case 0:
          router.push(`/seller/upload-information?tradeKey=${tradeKey} `); // 跳转到上传账户信息页面
          break;
        case 1:
          toast({
            title: 'Waiting for Buyer Action',
            description: 'The buyer is currently requesting 2FA.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          break;
        case 2:
          toast({
            title: 'Trade Confirmation in Progress',
            description: 'The buyer is currently confirming the trade.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          break;
        case 3:
          toast({
            title: 'Waiting for Buyer Password Change',
            description: 'The buyer is updating the account password.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          break;
        case 4:
          router.push(`/seller/withdraw-funds?tradeKey=${tradeKey}`); // 跳转到提现资金页面
          break;
        default:
          toast({
            title: 'Invalid Step',
            description: `Step ${stepInt} is not recognized.`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} padding={6} align="center">
      <Heading size="lg">Seller Trade Step Check</Heading>
      <Box w="full" maxW="md" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Text mb={4}>Enter the trade key to check the current step of the trade:</Text>
        <Input
          placeholder="Enter trade key"
          value={tradeKey}
          onChange={(e) => setTradeKey(e.target.value)}
          mb={4}
        />
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          w="full"
        >
          Check Trade Step
        </Button>
      </Box>
    </VStack>
  );
};

export default TradeAsSeller;

