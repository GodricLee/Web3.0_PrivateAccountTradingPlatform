import { useState } from 'react';
import { VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
const PasswordChange = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast({
        title: 'Error',
        description: 'Please enter your new password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const router = useRouter();
    const { tradeKey } = router.query; // 从 URL 查询参数中获取 tradeKey
    const { data } = useSession();
    const buyerAddress = data?.user?.address;
    try {
      setLoading(true);

      // 调用后端 API 处理密码修改
      const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeKey,newPassword,buyerAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password.');
      }

      toast({
        title: 'Success',
        description: 'Password changed successfully!',
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
      <Heading size="lg">Change Password</Heading>
      <Input
        placeholder="Enter new password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button colorScheme="blue" onClick={handlePasswordChange} isLoading={loading}>
        Change Password
      </Button>
    </VStack>
  );
};

export default PasswordChange;
