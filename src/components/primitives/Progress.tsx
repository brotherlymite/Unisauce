import { Box } from "rebass/styled-components";

type Props = {
  progress: number;
};

const Progress = ({ progress }: Props) => {
  return (
    <Box
      bg={"flash"}
      width={`${progress * 100}%`}
      height={14}
      mt={1}
      sx={{
        borderRadius: "10px",
      }}
    ></Box>
  );
};

export default Progress;
