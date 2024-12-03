import { useState, useEffect } from 'react';
import {
  VStack, Heading, Button, useToast, Checkbox, Text,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton, HStack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ethers } from 'ethers';

const FundUpload = () => {
  if (typeof window === 'undefined') {
    // If server-side rendering, return null to avoid errors
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelChecked, setCancelChecked] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { tradeKey } = router.query; // Get tradeKey from URL query parameters
  const { data } = useSession();
  const buyerAddress = data?.user?.address;
  const [walletAddress, tradeamount, role, seed] = tradeKey
    ? atob(tradeKey as string).split(':')
    : ['', '', '', ''];

    useEffect(() => {
      const checkUploadedFunds = async () => {
        try {
          const response = await fetch('/api/checkUploadedFunds', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tradeKey, buyerAddress }),
          });
          const data2 = await response.json();
          const { uploadedfunds } = data2;
          if (uploadedfunds === 1) {
            toast({
              title: 'Funds already uploaded',
              description: 'You have already uploaded funds for this trade.',
              status: 'info',
              duration: 5000,
              isClosable: true,
              onCloseComplete: () => {
                router.push(`/trade/buyer/WaitingSeller?tradeKey=${tradeKey}`);
              },
            });
            
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      checkUploadedFunds();
    }, []);

  const handleCancelTradeClick = () => {
    setIsCancelModalOpen(true);
  };

  interface AnyoneCancelTradeParams {
    tradeKey2: string | string[] | undefined;
    requesterAddress: string | undefined;
  }

  const anyoneCancelTrade = async ({
    tradeKey2,
    requesterAddress,
  }: AnyoneCancelTradeParams): Promise<void> => {
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
      : ([] as any); // Ensure you have the contract ABI in your .env

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.anyone_cancel_trade(
      tradeKey2,
      requesterAddress
    );

    // Wait for the transaction to be mined
    await tx.wait();
  };

  const handleConfirmCancelTrade = async () => {
    try {
      setLoadingCancel(true);
      // Call the smart contract function
      await anyoneCancelTrade({
        tradeKey2: tradeKey,
        requesterAddress: buyerAddress,
      });

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

  const handleUploadFund = async () => {
    try {
      setLoading(true);

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
        : ([] as any); // Ensure you have the contract ABI in your .env

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tradeAmount_ = ethers.utils.parseUnits(tradeamount, 'ether'); // Convert amount to Wei

      const serviceFee = await fetchServiceFee(buyerAddress);
      const serviceFeeBigNumber = ethers.BigNumber.from(serviceFee);
      const serviceFeeAmount = serviceFeeBigNumber.add(
        ethers.BigNumber.from(100)
      );
      const stepAmount = tradeAmount_.mul(serviceFeeAmount);
      const totalAmount = stepAmount.div(ethers.BigNumber.from(100));

      const tx = await contract.buyer_upload_fund(tradeKey, buyerAddress, {
        value: totalAmount,
      });

      const receipt = await tx.wait();
      toast({
        title: 'Fund uploaded successfully!',
        description: `Transaction hash: ${receipt.transactionHash}`,
        status: 'success',
        duration: null,
        isClosable: true,
        onCloseComplete: async () => {
          const response = await fetch('/api/getTradeStep', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tradeKey, userAddress: buyerAddress }),
          });
    
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to fetch trade step from server.');
          }
    
          const { step } = await response.json();
          const stepInt = parseInt(step, 10);
          if(stepInt === 0){
            router.push(`/trade/buyer/WaitingSeller?tradeKey=${tradeKey}`);
          }
          if(stepInt === 1){
            router.push(`/trade/buyer/Request2fa?tradeKey=${tradeKey}`);
          }
        },
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
      setLoading(false);
    }
  };

  const fetchServiceFee = async (address: string) => {
    const feeResponse = await fetch('/api/getServiceFee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requester_address: address }),
    });

    if (!feeResponse.ok) {
      const errorResponse = await feeResponse.json();
      throw new Error(errorResponse.error || 'Failed to fetch service fee');
    }

    const { serviceFee } = await feeResponse.json();
    if (!serviceFee) {
      throw new Error('Service fee not provided by backend');
    }
    return serviceFee;
  };

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Upload Fund</Heading>
      <Heading size="md">
        Amount: {tradeamount} ETH (ServiceFee Not Included)
      </Heading>
      <HStack spacing={4}>
        <Button
          colorScheme="red"
          onClick={handleCancelTradeClick}
          isLoading={loadingCancel}
        >
          Cancel Trade
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleUploadFund}
          isLoading={loading}
        >
          Upload Fund
        </Button>
      </HStack>

      {/* Cancel Trade Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Cancel Trade</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Once the trade is canceled, the account funds will be returned,
              data will be automatically deleted on the smart contract side, and
              this operation cannot be undone.
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
            <Button
              variant="ghost"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default FundUpload;
