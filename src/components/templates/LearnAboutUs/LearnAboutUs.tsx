import {
  Box,
  VStack,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { CheckCircleIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import { useSession } from 'next-auth/react';

const LearnAboutUs = () => {
  const { data } = useSession();
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <VStack w="full" align="start" spacing={6} padding={6}>
      {/* Platform Overview */}
      <Box w="full" maxW="4xl" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading size="lg" mb={4}>
          About Our Platform
        </Heading>
        <Text color={textColor} mb={4}>
          Welcome to our Web3.0 Private Account Trading Platform! Our platform is designed to enable
          buyers and sellers to securely complete transactions without the need for mutual trust.
          Powered by blockchain technology, we ensure transparency, security, and fairness for every trade.
        </Text>
        <Text color={textColor} mb={4}>
          With features like decentralized fund escrow, real-time trade progress tracking, and dynamic
          2FA verification, our platform revolutionizes the way digital assets are exchanged, offering a
          seamless and secure trading experience for both buyers and sellers.
        </Text>
        <Text color={textColor} fontWeight="bold">
          Our smart contract is deployed on the Arbitrum network, offering fast and cost-effective
          transactions. Users benefit from the security and scalability of Ethereum while enjoying the
          low transaction fees of Layer 2 solutions.
        </Text>
      </Box>

      {/* Features */}
      <Box w="full" maxW="4xl" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading size="lg" mb={4}>
          Features of Our Platform
        </Heading>
        <List spacing={4}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">
              Blockchain-Powered Security:
            </Text>{' '}
            All transactions are recorded and verified on a decentralized ledger, ensuring trust and
            transparency.
          </ListItem>
          <ListItem>
            <ListIcon as={LockIcon} color="blue.500" />
            <Text display="inline" fontWeight="bold">
              Advanced 2FA Mechanism:
            </Text>{' '}
            Our platform integrates a dynamic Two-Factor Authentication (2FA) system to secure account
            details during the trade process. This mechanism ensures that:
            <List mt={2} pl={8} spacing={2}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Buyers can verify account authenticity without modifying its contents.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Sellers can trust that their account information remains secure until the trade is complete.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Sellers must ensure that the uploaded account requires a 2FA code for login. This is a
                critical step to guarantee transaction security and prevent unauthorized access during the
                trade.
              </ListItem>
              <ListItem>
                <ListIcon as={InfoIcon} color="teal.500" />
                <Text display="inline" fontWeight="bold">
                  Why 2FA Matters:
                </Text>{' '}
                This mechanism provides an additional layer of protection, ensuring that even if a
                transaction is canceled, sensitive account details remain inaccessible to unauthorized
                parties.
              </ListItem>
            </List>
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">
              Real-Time Trade Progress Tracking:
            </Text>{' '}
            Users can log in at any time to check their trade status, ensuring transparency and continuity
            even in case of interruptions.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">
              Flexible Cancellation Policy:
            </Text>{' '}
            Either party can cancel the trade before its critical steps, protecting users in case of
            disputes or unexpected issues.
          </ListItem>
        </List>
      </Box>

      {/* Trade Process Overview */}
      <Box w="full" maxW="4xl" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading size="lg" mb={4}>
          How the Trade Process Works
        </Heading>
        <List spacing={4}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">Step 1:</Text> The seller uploads account details (platform URL, username, password, and 2FA key) to the smart contract.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">Step 2:</Text> The buyer deposits the agreed-upon payment amount into the smart contract.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">Step 3:</Text> The smart contract generates and provides a one-time 2FA code for the buyer to verify the account's authenticity.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">Step 4:</Text> Upon verification, the buyer confirms the trade, and the full 2FA key is released.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline" fontWeight="bold">Step 5:</Text> The buyer updates the account password and confirms completion. The funds are then released to the seller.
          </ListItem>
        </List>
      </Box>

      {/* Reminder */}
      <Alert status="info" borderRadius="md" boxShadow="md" maxW="4xl" mt={6}>
        <AlertIcon />
        <AlertTitle fontSize="lg">Important Reminder:</AlertTitle>
        <AlertDescription>
          Our contract is deployed on the Arbitrum network. Please ensure that your wallet is connected
          to the Arbitrum network before using the platform.
        </AlertDescription>
      </Alert>
    </VStack>
  );
};

export default LearnAboutUs;
