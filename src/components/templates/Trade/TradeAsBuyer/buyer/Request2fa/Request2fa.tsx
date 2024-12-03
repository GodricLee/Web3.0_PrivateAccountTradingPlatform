import {
  VStack,
  Heading,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Checkbox,
  useDisclosure,
  Spinner,
  ModalCloseButton,
  Box,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Request2FA = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const {
    isOpen: isFirstModalOpen,
    onOpen: onFirstModalOpen,
    onClose: onFirstModalClose,
  } = useDisclosure();
  const {
    isOpen: isSecondModalOpen,
    onOpen: onSecondModalOpen,
    onClose: onSecondModalClose,
  } = useDisclosure();

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalContent, setModalContent] = useState<'waiting' | 'code'>('waiting');
  const [twoFaCode, setTwoFaCode] = useState('');
  interface AccountInfo {
    login_url: string;
    account_username: string;
    account_password: string;
    two_fa_key: string;
    // Add other fields as necessary
  }
  
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isFetchingAccountInfo, setIsFetchingAccountInfo] = useState(false);

  const toast = useToast();
  const router = useRouter();
  const { tradeKey } = router.query;
  const { data } = useSession();
  const buyerAddress = data?.user?.address;

  const handleConfirmRequest2FA = async () => {
    if (!isCheckboxChecked) {
      toast({
        title: 'Reminder Not Confirmed',
        description: 'You have not confirmed the reminder.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onFirstModalClose();
    onSecondModalOpen();

    setIsProcessing(true);
    setModalContent('waiting');
    try {
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      let millisecondsToWait = 0;

      if (seconds < 30) {
        millisecondsToWait = (30 - seconds) * 1000 - milliseconds;
      } else {
        millisecondsToWait = (60 - seconds) * 1000 - milliseconds;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, millisecondsToWait);
      });

      const response = await fetch('/api/request2FA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey, buyerAddress }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to request 2FA.');
      }

      const { twoFaCode: twoFACode } = await response.json();
      setTwoFaCode(twoFACode);

      setModalContent('code');
    } catch (error) {
      onSecondModalClose();
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetAccountInfo = async () => {
    setIsFetchingAccountInfo(true);
    try {
      const response = await fetch('/api/getAccountInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey, buyerAddress }),
      });
      

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to get account info.');
      }

      const data2 = await response.json();
      
      
      setAccountInfo(data2.accountInfo);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsFetchingAccountInfo(false);
    }
  };

  const handleProceed = async () => {
    try {
      const response = await fetch('/api/stepPlus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey, buyerAddress }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to proceed.');
      }

      router.push(`/trade/buyer/ConfirmTrade?tradeKey=${tradeKey}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Check Account and Request 2FA</Heading>

      <Button colorScheme="teal" onClick={handleGetAccountInfo} isLoading={isFetchingAccountInfo}>
        Get and Check Account Info
      </Button>

      {accountInfo && (
        <Box
          p={4}
          borderWidth={1}
          borderRadius="lg"
          width="100%"
          textAlign="left"
          boxShadow="md"
          bg="#9FCBF1" 
        >
          <Heading size="lg" textAlign="center" color="teal.500">
            Account Information
          </Heading>
          <Divider mb={4} />
          {/* Replace with your account info fields */}
          <Text fontSize="xl" color="teal.500"><strong>Login URL:</strong> {accountInfo.login_url}</Text>
          <Text fontSize="xl" color="teal.500"><strong>Username:</strong> {accountInfo.account_username}</Text>
          <Text fontSize="xl" color="teal.500"><strong>Password:</strong> {accountInfo.account_password}</Text>
          {/* ... other account info */}
        </Box>
      )}

      <Button colorScheme="blue" onClick={onFirstModalOpen}>
        Request one-time 2FA code
      </Button>

      {/* First Modal */}
      <Modal isOpen={isFirstModalOpen} onClose={onFirstModalClose}>
        <ModalOverlay />
        <ModalContent width="50%">
          <ModalHeader>Please Read Carefully</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={6}>
              Please note that you have only one chance to retrieve the 2FA code for verifying your
              account. Since the verification code is valid for 30 seconds, ensure that the login
              page requiring the 2FA code is already open and ready.
              <br />
              If you fail to log in due to timing, you accept full responsibility.
              <br />
              We will provide you with a 2FA code that is valid for a full 30-second period. After your confirmation, you may need to wait up to
              30 seconds to receive the latest real-time 2FA code.
            </Text>
            <Checkbox
              isChecked={isCheckboxChecked}
              onChange={(e) => setIsCheckboxChecked(e.target.checked)}
            >
              I have read the above reminder and have opened the login page that requires me to
              enter the real-time 2FA code.
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleConfirmRequest2FA}
              isLoading={isProcessing}
            >
              Confirm: Request 2FA Code
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Second Modal */}
      <Modal
        isOpen={isSecondModalOpen}
        onClose={modalContent === 'code' ? onSecondModalClose : () => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalContent === 'waiting' ? 'Please Wait' : 'Your 2FA Code'}
          </ModalHeader>
          <ModalBody>
            {modalContent === 'waiting' ? (
              <>
                <Text mb={4}>Fetching the latest dynamic 2FA code...</Text>
                <Spinner />
              </>
            ) : (
              <>
                <Heading size="md" mt={4}>
                  2FA Code: {twoFaCode}
                </Heading>
                <Text mt={4}>
                  This code is valid for 30 seconds, please log in as soon as possible.
                </Text>
              </>
            )}
          </ModalBody>
          {modalContent === 'code' && (
            <ModalFooter>
              <Button colorScheme="blue" onClick={onSecondModalClose}>
                Close
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>

      <Button colorScheme="green" onClick={handleProceed}>
        Finished checking account? Click to continue
      </Button>
    </VStack>
  );
};

export default Request2FA;
