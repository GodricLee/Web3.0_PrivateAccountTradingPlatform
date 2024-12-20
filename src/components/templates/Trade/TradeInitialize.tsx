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
  Center,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNetwork, useAccount } from 'wagmi';
import Moralis from 'moralis';
import { ethers } from 'ethers';


const TradeInitialize = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const toast = useToast();
  const address = data?.user?.address;
  const isConnected = data?.user?.address && chain?.id;
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeKey, setTradeKey] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [userRole, setUserRole] = useState('');

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
      const [walletAddress, amount, role, seed] = atob(tradeKey).split(':');
      if (!walletAddress || !amount || !role || !seed) {
        throw new Error('Invalid key format');
      }

      if (walletAddress === address) {
        throw new Error('You cannot trade with yourself');
      }
      const opposite_role = role === 'Buyer' ? 'Seller' : 'Buyer';

      toast({
        position: 'top', // Center the toast
        render: ({ onClose }) => (
          <Center p={6} bg="#9FCBF1" border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="md" position="relative">
            <VStack spacing={4}>
              <Text fontWeight="bold" color="black">Trade Key Accepted</Text>
              <Text color="black">Trade amount: {amount} ETH</Text>
              <Text color="black">Your role: {opposite_role}</Text>
              <Text color="black">{role} address: {walletAddress}</Text>
              <Text color="black">{opposite_role} address: {address}</Text>
              <Button colorScheme="green" onClick={() => { handleConfirmAndProceed(); onClose(); }}>
              Confirm Trade and Proceed
              </Button>
            </VStack>
            <Button position="absolute" top={2} right={2} bg="transparent" color="red" onClick={onClose}>
              ✕
            </Button>
          </Center>
        ),
        isClosable: true, // Only closable by user interaction
        duration: null, // Make the toast persistent until user closes it
      });

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

  const handleConfirmAndProceed = async () => {
    try {
      // Decode the trade key to get the other party's address and trade details
      const [walletAddress, amount, role, seed] = atob(tradeKey).split(':');
      if (!walletAddress || !amount || !role || !seed) {
        throw new Error('Invalid trade key format');
      }
      // 判断当前用户角色，并动态设置 buyerAddress 和 sellerAddress
      const sellerAddress = role === 'Buyer' ? address : walletAddress;
      const buyerAddress = role === 'Seller' ? address : walletAddress;
  
      // 使用 MetaMask 连接并签署交易
      const { ethereum } = window;
      if (!ethereum) {
        toast({
          title: 'MetaMask Not Found',
          description: 'Please install MetaMask and connect your wallet.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      const provider = new ethers.providers.Web3Provider(ethereum as any);
      const signer = provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
      // console.log("Contract Address:", contractAddress);
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI) : [] as any;  // 请确保你在 .env 中有合约 ABI
  
      const contract = new ethers.Contract(contractAddress, abi, signer);
  
      const tradeAmount_ = ethers.utils.parseUnits(amount, 'ether'); // Convert amount to Wei

      // toast({
      //   title: 'TEST',
      //   description: `TradeKey:${tradeKey} buyerAddress:${buyerAddress} sellerAddress:${sellerAddress} tradeAmount:${tradeAmount_}`,
      //   status: 'success',
      //   duration: 5000,
      //   isClosable: true,
      // });
      // 创建交易
      const tx = await contract.createTrade(
        tradeKey,
        buyerAddress,
        sellerAddress,
        tradeAmount_
      );
  
      // 等待交易确认
      const receipt = await tx.wait();
      toast({
        title: 'Trade created successfully!',
        description: `Transaction hash: ${receipt.transactionHash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // Send trade data to the backend for smart contract interaction
      const backendResponse = await fetch('/api/createTrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tradeKey,
          buyerAddress,
          sellerAddress,
          tradeAmount: tradeAmount_.toString(),
        }),
      });
  
      if (!backendResponse.ok) {
        const errorResponse = await backendResponse.json();
        throw new Error(errorResponse.error || 'Failed to create trade on the backend');
      }
  
      const responseJson = await backendResponse.json();

    } catch (error) {
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <Box p={6} bg="red.500" color="white" borderRadius="md" maxW="xl">
            <Text fontWeight="bold">Error</Text>
            <Text>{(error as Error).message || 'An unexpected error occurred during the trade process.'}</Text>
            <Button onClick={onClose} mt={4}>
              Close
            </Button>
          </Box>
        ),
        duration: null,
        isClosable: true,
      });
    }
  }
  
  


  return (
    <VStack w={'full'} align="center" spacing={6} padding={6}>
      <Heading size="lg">Trade Initialize</Heading>

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


export default TradeInitialize;
