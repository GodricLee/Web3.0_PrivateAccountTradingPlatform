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

const Buyer = () => {
  const [tradeKey, setTradeKey] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

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
        body: JSON.stringify({ tradeKey }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to fetch trade step from server.');
      }

      const { step } = await response.json();

      // 根据返回的 step 值进行页面跳转
      switch (step) {
        case 0:
          router.push('/buyer/fund-upload'); // 跳转到资金上传页面
          break;
        case 1:
          router.push('/buyer/request-2fa'); // 跳转到 2FA 验证页面
          break;
        case 2:
          router.push('/buyer/confirm-trade'); // 跳转到交易确认页面
          break;
        case 3:
          router.push('/buyer/password-change'); // 跳转到密码修改页面
          break;
        case 4:
          router.push('/buyer/trade-complete'); // 跳转到交易完成页面
          break;
        default:
          toast({
            title: 'Invalid Step',
            description: `Step ${step} is not recognized.`,
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
      <Heading size="lg">Buyer Trade Step Check</Heading>
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

export default Buyer;

