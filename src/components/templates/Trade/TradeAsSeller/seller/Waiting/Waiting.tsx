import { useState, useEffect } from 'react';
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
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ethers } from 'ethers';

const Waiting = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const toast = useToast();
  const router = useRouter();
  const { tradeKey } = router.query;
  const { data } = useSession();
  const sellerAddress = data?.user?.address;

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelChecked, setCancelChecked] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [autoConfirmed, setAutoConfirmed] = useState<number | null>(null);

  useEffect(() => {
    const checkAutoConfirmation = async () => {
      try {
        const response = await fetch('/api/changePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tradeKey, buyerAddress: sellerAddress }),
        });
        const result = await response.json();
        if (result.auto_confirmed === 1) {
          toast({
            title: '30 minutes have passed, the trade has automatically ended.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          router.push(`/trade/seller/WithdrawFunds?tradeKey=${tradeKey}`);
        } else {
          setAutoConfirmed(0);
        }
      } catch (error) {
        console.error('Error checking auto confirmation:', error);
      }
    };

    checkAutoConfirmation();
  }, [router, toast, tradeKey, sellerAddress]);

  if (autoConfirmed === null) {
    return null;
  }
  const handleCancelTradeClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancelTrade = async () => {
    try {
      setLoadingCancel(true);

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
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI
        ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI)
        : [];

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.anyone_cancel_trade(tradeKey, sellerAddress);

      await tx.wait();

      toast({
        title: 'Trade Canceled',
        description: 'The trade has been canceled successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsCancelModalOpen(false);
      setCancelChecked(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg" textAlign="center">
        The buyer is currently processing the trade. Please be patient. You can choose to cancel the trade at any time.
      </Heading>
      <Button colorScheme="red" onClick={handleCancelTradeClick}>
        Cancel Trade
      </Button>

      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Trade Cancellation</ModalHeader>
          <ModalBody>
            <Text>
              Once the trade is canceled, the funds will be returned to your account, and the data in the smart contract will be automatically deleted. This action cannot be undone.
            </Text>
            <Checkbox
              mt={4}
              isChecked={cancelChecked}
              onChange={(e) => setCancelChecked(e.target.checked)}
            >
              I understand and confirm the cancellation of the trade.
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleConfirmCancelTrade}
              isDisabled={!cancelChecked}
              isLoading={loadingCancel}
            >
              Confirm Cancellation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Waiting;
