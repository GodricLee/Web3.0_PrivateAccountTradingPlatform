import { useState, useEffect } from 'react';
import { VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ethers } from 'ethers';
const UploadInformation = () => {
  if (typeof window === 'undefined') {
    // 如果是服务器端渲染，返回空，避免错误
    return null;
  }
  const [loginUrl, setLoginUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFaKey, setTwoFaKey] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const router = useRouter();
  const { tradeKey } = router.query; // 从 URL 查询参数中获取 tradeKey
  const { data } = useSession();
  const sellerAddress = data?.user?.address;

  useEffect(() => {
    const checkUploadedFunds = async () => {
      try {
        const response = await fetch('/api/checkUploadedFunds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tradeKey, buyerAddress: sellerAddress }),
        });
        const data2 = await response.json();
        const { uploadedaccount } = data2;
        if (uploadedaccount === 1) {
          router.push(`/trade/seller/Waiting?tradeKey=${tradeKey} `);
          
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUploadedFunds();
  }, []);

  const handleUpload = async () => {
    if (!loginUrl || !username || !password || !twoFaKey) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      
      const abi = process.env.NEXT_PUBLIC_CONTRACT_ABI ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI) : [] as any;  // 请确保你在 .env 中有合约 ABI
  
      const contract = new ethers.Contract(contractAddress, abi, signer);



      const tx = await contract.seller_upload_information(
        tradeKey, 
        sellerAddress,
        loginUrl,
        username,
        password,
        twoFaKey,
      );

      const receipt = await tx.wait();
      toast({
        title: 'Account information uploaded successfully',
        description: `Transaction hash: ${receipt.transactionHash}`,
        status: 'success',
        duration: null,
        isClosable: true,
        onCloseComplete: () => {
          router.push(`/trade/seller/Waiting?tradeKey=${tradeKey}`);
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

  return (
    <VStack spacing={6} padding={6}>
      <Heading size="lg">Upload Account Information</Heading>
      <Input
        placeholder="Login URL"
        value={loginUrl}
        onChange={(e) => setLoginUrl(e.target.value)}
      />
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        placeholder="2FA Key"
        value={twoFaKey}
        onChange={(e) => setTwoFaKey(e.target.value)}
      />
      <Button colorScheme="blue" onClick={handleUpload} isLoading={loading}>
        Upload Information
      </Button>
    </VStack>
  );
};

export default UploadInformation;
