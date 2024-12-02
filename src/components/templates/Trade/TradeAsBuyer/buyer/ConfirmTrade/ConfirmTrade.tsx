import React, { useState } from 'react';
import {
  VStack,
  Heading,
  Button,
  useToast,
  Checkbox,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

const ConfirmTradePage = () => {
  if (typeof window === 'undefined') {
    // If server-side rendering, return null to avoid errors
    return null;
  }

  const { data } = useSession();
  const address = data?.user?.address;
  const router = useRouter();
  const { tradeKey } = router.query; // Get tradeKey from URL query parameters
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cancelChecked, setCancelChecked] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [twoFAKey, setTwoFAKey] = useState<string | null>(null);
  const toast = useToast();

  const handleCancelTradeClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmTradeClick = () => {
    setIsConfirmModalOpen(true);
  };

  interface AnyoneCancelTradeParams {
    tradeKey2: string | string[] | undefined;
    requesterAddress: string | undefined;
  }

  const anyoneCancelTrade = async ({ tradeKey2, requesterAddress }: AnyoneCancelTradeParams): Promise<void> => {
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
      
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI) : [] as any;  // 请确保你在 .env 中有合约 ABI
  
      const contract = new ethers.Contract(contractAddress, abi, signer);

    
      const tx = await contract.anyone_cancel_trade(tradeKey2, requesterAddress);

      // Wait for the transaction to be mined
      await tx.wait();
  };

  const handleConfirmCancelTrade = async () => {
    try {
      setLoadingCancel(true);
      // Call the smart contract function
      await anyoneCancelTrade({ tradeKey2: tradeKey, requesterAddress: address });

      toast({
        title: 'Trade Canceled',
        description: 'The trade has been canceled successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Close modal
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

  const handleConfirmTrade = async () => {
    try {
      setLoadingConfirm(true);

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
      
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI) : [] as any;  // 请确保你在 .env 中有合约 ABI
      
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.buyer_confirm_trade(tradeKey, address);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Assume that the 2FA key is returned in the response events
      const two_FAKey: string | undefined = receipt.events?.find((event: ethers.Event) => event.event === 'TradeConfirmed')?.args?.two_fa_key;
      setTwoFAKey(two_FAKey ?? null);

      toast({
        title: 'Trade Confirmed',
        description: 'The trade has been confirmed successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg" textAlign="center">
        Having thoroughly reviewed the account, you can now decide whether to confirm the trade or
        cancel it. Please choose your next action carefully.
      </Heading>
      <Button colorScheme="red" onClick={handleCancelTradeClick}>
        Cancel Trade
      </Button>
      <Button colorScheme="green" onClick={handleConfirmTradeClick}>
        Confirm Trade
      </Button>

      {/* Cancel Trade Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Cancel Trade</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Once the trade is canceled, the account funds will be returned, data will be
              automatically deleted on the smart contract side, and this operation cannot be undone.
            </Text>
            <Checkbox
              mt={4}
              isChecked={cancelChecked}
              onChange={(e) => setCancelChecked(e.target.checked)}
            >
              I understand and confirm to cancel the trade.
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
              I Confirm to Cancel Trade
            </Button>
            <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Trade Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Trade</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Once you confirm the trade, this operation cannot be undone, and the trade cannot be
              canceled.
            </Text>
            <Text mt={2}>
              After confirming the trade, the complete 2FA key will be provided to you. You need to
              change the password as soon as possible and confirm. If you do not confirm, and during
              this period the seller maliciously changes the password causing losses, you will be
              responsible.
            </Text>
            <Checkbox
              mt={4}
              isChecked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
            >
              I have understood, I confirm the trade.
            </Checkbox>

            {twoFAKey && (
              <>
                <Text mt={4}>
                  Your 2FA Key: <strong>{twoFAKey}</strong>
                </Text>
                <Text mt={2}>
                  Please change the password as soon as possible, then confirm the trade.
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {!twoFAKey ? (
              <>
                <Button
                  colorScheme="green"
                  mr={3}
                  onClick={handleConfirmTrade}
                  isDisabled={!confirmChecked}
                  isLoading={loadingConfirm}
                >
                  I Have Understood, I Confirm the Trade
                </Button>
                <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() =>
                    router.push(`/trade/buyer/PasswordChange?tradeKey=${tradeKey}`)
                  }
                >
                  I Have Changed the Password
                </Button>
                <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
                  Close
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ConfirmTradePage;
