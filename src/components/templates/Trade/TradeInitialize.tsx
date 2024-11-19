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
          <Text color="black">Your role: {role}</Text>
          <Text color="black">{role} address: {address}</Text>
          <Text color="black">{opposite_role} address: {walletAddress}</Text>
          <Button colorScheme="green" onClick={handleConfirmAndProceed}>
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

    // Prepare data for transaction
    const tradeAmount_ = ethers.utils.parseUnits(amount, 'ether'); // Convert amount to Wei
    const serviceFee = tradeAmount_.mul(1).div(100); // 这里其实应该从后端读取费用，这里应该实现接口。
    const totalAmount = tradeAmount_.add(serviceFee); // Total amount including service fee


    // Interact with the smart contract to initiate the trade
    const contractAddress = '0xYourContractAddress'; // 这里要修改合约地址
    const abi = [
      // The relevant ABI for your smart contract
      {
        "inputs": [
          { "internalType": "string", "name": "new_key", "type": "string" },
          { "internalType": "address", "name": "buyer_address", "type": "address" },
          { "internalType": "address", "name": "seller_address", "type": "address" },
          { "internalType": "uint256", "name": "trade_amount", "type": "uint256" }
        ],
        "name": "createTrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    if (!window.ethereum) {
      throw new Error('Ethereum object not found, please install MetaMask.');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.createTrade(
      tradeKey, // Trade key
      address,   // Buyer address
      walletAddress, // Seller address
      totalAmount // Total amount including service fee
    );

    // Wait for the transaction to be mined
    await tx.wait();

    //Notify the user of successful trade creation
    toast({
      title: 'Trade Created',
      description: 'The trade has been successfully created,please come to your role\'s page to proceed.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

  } catch (error) {
    // Handle any errors that may occur during the process
    toast({
      title: 'Error',
      description: (error as Error).message || 'An unexpected error occurred during the trade process.',
      status: 'error',
      duration: 3000,
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
