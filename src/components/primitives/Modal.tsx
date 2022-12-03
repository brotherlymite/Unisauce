import { Box, Text } from "rebass/styled-components";

interface ModalProps {
  show: boolean;
  height?: number | string;
  width?: number;
  heading?: string;
  children: JSX.Element;
  close: () => void;
}

// const CloseIcon = styled.div`
//   > i {
//     color: #4a4a5c;
//     font-size: 25px;
//     transition: 0.5s;
//     :hover {
//       cursor: pointer;
//       color: #57576c;
//     }
//   }
// `;

const BasicModal = ({ heading, show, height = 400, width = 400, children, close }: ModalProps) => {
  return (
    <>
      {show && (
        <>
          <Box
            onClick={close}
            backgroundColor={"#a4a4a4"}
            height={"100vh"}
            width={"100%"}
            opacity={0.9}
            sx={{
              position: "absolute",
              zIndex: 3,
            }}
          ></Box>
          <Box
            width={width}
            height={height}
            padding={20}
            backgroundColor={"fadedDark"}
            sx={{
              border: `1px solid #262638`,
              borderRadius: 10,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
              zIndex: 4,
            }} 
          >
            {heading && (
              <Box
                sx={{
                  borderRadius: "10px",
                  border: "2px solid",
                  borderColor: "#c95288",
                  backgroundColor: "#D11268",
                }}
                display={"flex"}
                marginX={0.5}
                marginTop={1}
                padding={10}
              >
                <i className="fa fa-info-circle white" aria-hidden="true"></i>
                <Text fontSize={12} mt={-0.5} fontFamily={"Roboto Mono"} ml={2} color={"white"}>
                  {heading}
                </Text>
              </Box>
            )}
            {children}
          </Box>
        </>
      )}
    </>
  );
};

export default BasicModal;
