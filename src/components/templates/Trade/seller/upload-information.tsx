import { useState } from 'react';
import { VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';

const UploadInformation = () => {
  const [loginUrl, setLoginUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFaKey, setTwoFaKey] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

      const response = await fetch('/api/uploadInformation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginUrl, username, password, twoFaKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload account information.');
      }

      toast({
        title: 'Success',
        description: 'Account information uploaded successfully!',
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
