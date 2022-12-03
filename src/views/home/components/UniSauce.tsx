import { UniswapSmokin } from "app/assets";
import AppButton from "components/primitives/Button";
import {ethers} from "ethers";
import useUniSauce from "hooks/useUniSauce";
import Countdown from 'react-countdown';
import { Box, Text, Flex, Image } from "rebass/styled-components";

type Props = {};

const NULL = '0x0000000000000000000000000000000000000000';

const UniSauce = (props: Props) => {
  const { state, actions: {buyCoveredCall} } = useUniSauce();
  const expiry = Date.now() + (24 * 2 * 60* 60 * 1000);
  console.log(state);

  function handleAction() {
    if(!state.buyer) {
      buyCoveredCall();
      return;
    }
    
    if(Date.now() >= expiry) {
      return;
    }
  }
  return (
    <>
    <Image src={UniswapSmokin} width={300} height={300} sx={{
      position: 'absolute',
      zIndex: 0
    }} />
    <Box display={'grid'} alignContent={'center'} height={'100vh'}>
      <Box width={"50%"} margin={"auto"}>
        <Box textAlign="center">
            <Countdown autoStart className="countdown" date={expiry} />
        </Box>
        <Flex
          flexDirection={'column'}
          height={'auto'}
          padding={20}
          sx={{
            borderRadius: 3,
            border: "1.5px solid #333",
          }}
        >
          <Box>
              <Text fontFamily={'Roboto Mono'} fontSize={20} fontWeight={'medium'}>Seller</Text>
              <Text fontFamily={'Roboto Mono'} fontSize={36}>{state.seller.slice(0,5) + '...' + state.seller.slice(38, 42)}</Text>
            </Box>
            <Box>
              <Text fontFamily={'Roboto Mono'} fontSize={20} fontWeight={'medium'}>Buyer</Text>
              {state.buyer !== NULL? <Text fontFamily={'Roboto Mono'} fontSize={36}>{state.buyer.slice(0,5) + '...' + state.buyer.slice(38, 42)}</Text>: 
              <Text backgroundColor={'flash'} color={'white'} padding={2} mb={3} mt={1} width={'fit-content'} px={4} fontFamily={'Roboto Mono'} fontSize={20} fontWeight={'medium'}>Not sold</Text>}

            </Box>
          <Flex justifyContent={'space-between'}>
            
            <Box>
              <Text fontFamily={'Roboto Mono'} fontSize={20} fontWeight={'medium'}>Collateral</Text>
              <Text fontFamily={'Roboto Mono'} fontSize={36}>{state.collateral.toString()} ETH</Text>
            </Box>
            <Box textAlign={'right'}>
              <Text fontFamily={'Roboto Mono'} fontSize={20} fontWeight={'medium'}>Price</Text>
              <Text fontFamily={'Roboto Mono'} fontSize={36}>${Number(ethers.utils.formatEther(state.price.toString())).toFixed(3)}</Text>
            </Box>
          </Flex>
          <Box height={20} />
          <Flex justifyContent={'space-between'}>
            <Box>
              <Text fontFamily={'Roboto Mono'} fontSize={20} fontWeight={'medium'}>Strike Price⚡</Text>
              <Text fontFamily={'Roboto Mono'} fontSize={36}>${Number(ethers.utils.formatEther(state.strikePrice.toString())).toFixed(3)}</Text>
            </Box>
            <Box textAlign={'right'}>
              <Text fontFamily={'Roboto Mono'} fontSize={20} fontWeight={'medium'}>Premium</Text>
              <Text fontFamily={'Roboto Mono'} fontSize={36}>{Number(ethers.utils.formatEther(state.premium.toString())).toFixed(3)} DAI</Text>
            </Box>
          </Flex>
          <Box height={50} />
          <AppButton
          style={{
            height: 70,
          }}
          label={state.buyer? "Exercise Covered Call": 'Buy Covered Call'} onPress={handleAction} />
        </Flex>
      </Box>
    </Box>
    </>
  );
};

export default UniSauce;
