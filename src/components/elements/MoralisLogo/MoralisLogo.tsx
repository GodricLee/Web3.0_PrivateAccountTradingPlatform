// @wqh 24.11.17 00:41 修改了alt
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
      //change alt="Moralis" -> alt="Tradeding Platform"
      alt="Tradeding Platform"
    />
  );
};

export default MoralisLogo;
