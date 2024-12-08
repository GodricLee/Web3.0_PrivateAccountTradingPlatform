import { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tr, Th, Tbody, Td, TableContainer, Tfoot, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface TradeInfo {
  buyer_address: string;
  seller_address: string;
  trade_key: string;
  trade_status: string;
  trade_amount: string;
  trade_creation_time: string;
  trade_end_time: string;
}

const SellingRecords = () => {
  const { data } = useSession();
  const address = data?.user?.address;
  const [tradeInfos, setTradeInfos] = useState<TradeInfo[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    if (address) {
      axios
        .post('/api/getSellingInfo', { sellerAddress: address })
        .then((response) => {
          setTradeInfos(response.data.tradeInfos);
        })
        .catch((error) => {
          console.error('Error fetching selling records:', error);
        });
    }
  }, [address]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      return prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'green.500';
      case 'Completed':
        return 'blue.500';
      case 'Cancelled':
        return 'red.500';
      default:
        return 'black';
    }
  };

  const getDisplayText = (text: string, expanded: boolean) => {
    return expanded ? text : `${text.slice(0, 3)}...${text.slice(-3)}`;
  };

  return (
    <>
      <Heading size="lg" mb={6}>
        Selling Records
      </Heading>
      {tradeInfos.length ? (
        <Box border="2px" borderColor={hoverTrColor} borderRadius="xl" p="24px 18px">
          <TableContainer w="full">
            <Table>
              <Thead>
                <Tr>
                  <Th>Trade Key</Th>
                  <Th>Buyer</Th>
                  <Th>Seller</Th>
                  <Th>Amount</Th>
                  <Th>Creation Time</Th>
                  <Th>End Time</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tradeInfos.map((trade, index) => (
                  <Tr key={index} _hover={{ bgColor: hoverTrColor }}>
                    <Td onClick={() => toggleRow(index)} cursor="pointer">
                      {getDisplayText(trade.trade_key, expandedRows.includes(index))}
                    </Td>
                    <Td onClick={() => toggleRow(index)} cursor="pointer">
                      {getDisplayText(trade.buyer_address, expandedRows.includes(index))}
                    </Td>
                    <Td onClick={() => toggleRow(index)} cursor="pointer">
                      {getDisplayText(trade.seller_address, expandedRows.includes(index))}
                    </Td>
                    <Td>{(parseFloat(trade.trade_amount) / 1e18).toFixed(7)} ETH</Td>
                    <Td>{new Date(parseInt(trade.trade_creation_time) * 1000).toLocaleDateString()}</Td>
                    <Td>{trade.trade_end_time !== '0' ? new Date(parseInt(trade.trade_end_time) * 1000).toLocaleDateString() : ''}</Td>
                    <Td color={getStatusColor(trade.trade_status)}>{trade.trade_status}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Trade Key</Th>
                  <Th>Buyer</Th>
                  <Th>Seller</Th>
                  <Th>Amount</Th>
                  <Th>Creation Time</Th>
                  <Th>End Time</Th>
                  <Th>Status</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>No selling records found.</Box>
      )}
    </>
  );
};

export default SellingRecords;