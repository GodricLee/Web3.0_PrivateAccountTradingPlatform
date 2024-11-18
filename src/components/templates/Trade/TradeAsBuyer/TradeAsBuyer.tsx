import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  useColorModeValue,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNetwork, useAccount } from 'wagmi';
import Moralis from 'moralis';

const TradeAsBuyer = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  // const { address, isConnected } = useAccount();
  const toast = useToast();
  const address = data?.user?.address;
  const isConnected = data?.user?.address && chain?.id;
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeKey, setTradeKey] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [userRole, setUserRole] = useState(''); // Added state for user role

  const handleGenerateKey = async () => {
    if (!isConnected || !address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet before generating a trade key.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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

    if (!userRole) {
      toast({
        title: 'Error',
        description: 'Please select your role as Buyer or Seller.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Generate key based on wallet address, trade amount, user role, and a seed
    const seed = Math.random().toString(36).substring(2);
    const key = btoa(`${address}:${tradeAmount}:${userRole}:${seed}`);
    setGeneratedKey(key);
    toast({
      title: 'Trade Key Generated',
      description: 'Copy and share this key with the counterpart.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleAcceptKey = async () => {
    if (!isConnected || !address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet before confirming a trade key.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      const [walletAddress, amount, role, seed] = atob(tradeKey).split(':');
      if (!walletAddress || !amount || !role || !seed) {
        throw new Error('Invalid key format');
      }

      if (walletAddress === address) {
        throw new Error('You cannot trade with yourself');
      }
      const opposite_role = role === 'Buyer' ? 'Seller' : 'Buyer';
      // Display trade details
      toast({
        title: 'Trade Key Accepted',
        description: (
          <>
            Trade amount: {amount} ETH as {opposite_role}.<br />
            {role} address: {address}.<br />
            {opposite_role} address: {walletAddress}.<br />
            Confirm to proceed.
          </>
        ),
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Logic for initiating a trade can be implemented here, using Moralis API if needed

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
        <Select placeholder="Select Role" onChange={(e) => setUserRole(e.target.value)} mb={4}>
          <option value="Buyer">I'm a Buyer</option>
          <option value="Seller">I'm a Seller</option>
        </Select>
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
