import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';

const MoralisLogo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={colorMode === 'dark' ? '/Moralis-DarkBG.svg' : '/Moralis-LightBG.svg'}
      height={45}
      width={150}
      //wqh,24.11.16 23:28
      //alt="Moralis" 
      alt="Tradeding Platform"
    />
  );
};

export default MoralisLogo;
