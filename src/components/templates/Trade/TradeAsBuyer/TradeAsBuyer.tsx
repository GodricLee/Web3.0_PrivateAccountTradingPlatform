import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNetwork } from 'wagmi';
import Moralis from 'moralis';

const TradeAsBuyer = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const toast = useToast();

  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeKey, setTradeKey] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');

  const handleGenerateKey = async () => {
    if (!tradeAmount) {
      toast({
        title: 'Error',
        description: 'Please enter the trade amount.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulating server-side key generation using amount and a seed
    const seed = Math.random().toString(36).substring(2);
    const key = btoa(`${tradeAmount}:${seed}`);
    setGeneratedKey(key);
    toast({
      title: 'Trade Key Generated',
      description: 'Copy and share this key with the seller.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleAcceptKey = async () => {
    if (!tradeKey) {
      toast({
        title: 'Error',
        description: 'Please paste the trade key.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Simulate server-side validation and response
      const [amount, seed] = atob(tradeKey).split(':');
      if (!amount || !seed) {
        throw new Error('Invalid key format');
      }

      // Display trade details
      toast({
        title: 'Trade Key Accepted',
        description: `Trade amount: ${amount} ETH. Confirm to proceed.`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Logic for initiating a trade can be implemented here, using Moralis API if needed
      // e.g., save transaction state on the blockchain

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Invalid Key',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack w={'full'} align="center" spacing={6} padding={6}>
      <Heading size="lg">Trade as Buyer</Heading>

      <Box w="full" maxW="md" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading size="md" mb={4}>Initiate Trade Request</Heading>
        <Input
          placeholder="Enter payment amount (ETH)"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(e.target.value)}
          mb={4}
        />
        <Button colorScheme="teal" onClick={handleGenerateKey} mb={4} w="full">
          Generate Trade Key
        </Button>
        {generatedKey && (
          <Box p={2} bg={hoverTrColor} borderRadius="md">
            <Text>Trade Key:</Text>
            <Text as="kbd" wordBreak="break-all">{generatedKey}</Text>
          </Box>
        )}
      </Box>

      <Box w="full" maxW="md" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading size="md" mb={4}>Accept Trade Request</Heading>
        <Input
          placeholder="Paste trade key here"
          value={tradeKey}
          onChange={(e) => setTradeKey(e.target.value)}
          mb={4}
        />
        <Button colorScheme="blue" onClick={handleAcceptKey} w="full">
          Confirm Trade Key
        </Button>
      </Box>
    </VStack>
  );
};

export default TradeAsBuyer;
