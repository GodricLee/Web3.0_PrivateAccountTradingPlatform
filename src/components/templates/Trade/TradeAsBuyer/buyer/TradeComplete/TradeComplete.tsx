import { VStack, Heading, Text } from '@chakra-ui/react';

const TradeComplete = () => {
  if (typeof window === 'undefined') {
    // 如果是服务器端渲染，返回空，避免错误
    return null;
  }
  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Trade Complete</Heading>
      <Text>Your trade has been successfully completed!</Text>
    </VStack>
  );
};

export default TradeComplete;
