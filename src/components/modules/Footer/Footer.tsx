import { Box, Link, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const links = {
  github: 'https://github.com/ethereum-boilerplate/ethereum-boilerplate/',
  forum: 'https://forum.moralis.io/',
  moralis: 'https://t.me/rteR_82',
};

const Footer = () => {
  return (
    <Box textAlign={'center'} w="full" p={6}>
      <Text>
        ⭐️ Please star this{' '}
        <Link href={links.github} isExternal alignItems={'center'}>
          project <ExternalLinkIcon />
        </Link>
        , every star makes us very happy!
      </Text>
      <Text>
        🙋 You have questions? Feel free to contact us at lz2300109991@gmail.com.
      </Text>
      <Text>
        📖 Telegram: {' '}
        <Link href={links.moralis} isExternal alignItems={'center'}>
        rteR_82 <ExternalLinkIcon />
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
