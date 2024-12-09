import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';

const MoralisLogo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={colorMode === 'dark' ? '/LOGO1.png' : '/LOGO2.png'}
      height={60}
      width={200}
      
      alt="Trading Platform"
    />
  );
};

export default MoralisLogo;
