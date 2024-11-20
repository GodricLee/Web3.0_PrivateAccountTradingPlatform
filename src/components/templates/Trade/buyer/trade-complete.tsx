import { VStack, Heading, Text } from '@chakra-ui/react';

const TradeComplete = () => {
  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Trade Complete</Heading>
      <Text>Your trade has been successfully completed!</Text>
    </VStack>
  );
};

export default TradeComplete;
