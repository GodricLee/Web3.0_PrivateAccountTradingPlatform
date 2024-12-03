import { VStack, Heading, Text } from '@chakra-ui/react';

const TradeCancelled = () => {
  if (typeof window === 'undefined') {
    // 如果是服务器端渲染，返回空，避免错误
    return null;
  }
  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg" textAlign="center" >Trade Cancelled</Heading>
      <Text fontSize="xl">Your trade has been cancelled. 
      <br />
        The account information has been automatically deleted.
      <br />
      If you wish to continue, consider initializing a new trade.
         </Text>
    </VStack>
  );
};

export default TradeCancelled;
