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
        body: JSON.stringify({ tradeKey, userAddress:address }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to fetch trade step from server.');
      }

      const { step } = await response.json();
      const stepInt = parseInt(step, 10);


      const response2 = await fetch('/api/checkSeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey,buyerAddress:address }),
      });

      if (!response2.ok) {
        const errorResponse2 = await response2.json();
        throw new Error(errorResponse2.error || 'Failed to check seller identity.');
      }

      const { isseller } = await response2.json();

      if(isseller === 0){

        toast({
          title: 'Error',
          description: 'You are not the seller of this trade.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }


      // 根据返回的 step 值进行页面跳转
      switch (stepInt) {
        case 0:
          router.push(`/trade/seller/UploadInformation?tradeKey=${tradeKey} `); // 跳转到上传账户信息页面
          break;
        case 1:
          router.push(`/trade/seller/Waiting?tradeKey=${tradeKey} `);
          break;
        case 2:
          router.push(`/trade/seller/Waiting?tradeKey=${tradeKey} `);
          break;
        case 3:
          router.push(`/trade/seller/Waiting?tradeKey=${tradeKey} `);
          break;
        case 4:
          router.push(`/trade/seller/WithdrawFunds?tradeKey=${tradeKey}`); // 跳转到提现资金页面
          break;
        case 5:
          router.push(`/trade/seller/TradeCancelled?tradeKey=${tradeKey}`); // 跳转到提现资金页面
          break;
        case 10:
          router.push(`/trade/seller/TradeComplete?tradeKey=${tradeKey}`); 
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
      <Heading size="lg">Seller Trade Entry</Heading>
      <Box w="full" maxW="md" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Text mb={4}>Input the trade key to enter your ongoing trade:</Text>
        <Input
          placeholder="Input trade key"
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
          Enter Your Ongoing Trade
        </Button>
      </Box>
    </VStack>
  );
};

export default TradeAsSeller;

