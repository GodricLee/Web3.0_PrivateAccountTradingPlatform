import { VStack, Heading, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';

const Request2FA = () => {
  const [loading, setLoading] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');
  const toast = useToast();

  const handleRequest2FA = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/request2FA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to request 2FA.');
      }

      const { twoFaCode: twoFACode } = await response.json();
      setTwoFaCode(twoFACode);

      toast({
        title: '2FA Code Received',
        description: 'Use this code for your trade.',
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
      <Heading size="lg">Request 2FA</Heading>
      <Button colorScheme="blue" onClick={handleRequest2FA} isLoading={loading}>
        Request 2FA
      </Button>
      {twoFaCode && (
        <Heading size="md" mt={4}>
          2FA Code: {twoFaCode}
        </Heading>
      )}
    </VStack>
  );
};

export default Request2FA;
