/* eslint-disable no-inline-comments */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from 'next/router';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem, Box, Text, Button } from '@chakra-ui/react';

const Home = () => {
  const router = useRouter(); // 使用 Next.js 的 useRouter 进行导航

  const handleGetStarted = () => {
    router.push('/trade/buyer'); // 导航到 /trade/buyer
  };

  const handleLearnMore = () => {
    router.push('/learn'); // 导航到 /learn
  };

  return (
    <VStack w={'full'} align="center" padding={6}>
      <Heading size="xl" marginBottom={6} textAlign="center">
        Web3.0 Private Account Trading Platform
      </Heading>
      <Box padding={4} borderWidth={1} borderRadius="md" boxShadow="sm" marginBottom={8}>
        <Text fontSize="lg" textAlign="center" marginBottom={4}>
          Secure transactions for buyers and sellers, powered by blockchain technology.
        </Text>
        <Button colorScheme="teal" size="lg" width="full" onClick={handleGetStarted}>
          Get Started
        </Button>
      </Box>
      <Heading size="md" marginBottom={6}>
        Key Features
      </Heading>
      <List spacing={3} width="full">
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Secure Account Transactions with Blockchain
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Buyer-Seller Trust Without Direct Interaction
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          2FA Key Protection Ensures Account Integrity
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Smart Contract-Powered Escrow for Safe Funds Transfer
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Cancellation & Refund Mechanism for Transaction Security
        </ListItem>
        <ListItem>
          <ListIcon as={InfoIcon} color="blue.500" />
          User-Friendly Interface with Material Design
        </ListItem>
      </List>
      <Box padding={4} borderWidth={1} borderRadius="md" boxShadow="sm" marginTop={6} width="full">
        <Text fontSize="md" textAlign="center" marginBottom={4}>
          Learn more about how the platform works, ensuring the security and privacy of every transaction.
        </Text>
        <Button colorScheme="blue" size="lg" width="full" onClick={handleLearnMore}>
          Learn More
        </Button>
      </Box>
    </VStack>
  );
};

export default Home;

