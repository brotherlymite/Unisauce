import React from "react";
import { Button } from "rebass/styled-components";

type Props = {
  label: string;
  style?: React.CSSProperties;
  rightIcon?: React.ReactElement;
  loading?: boolean;
  onPress: (e: React.MouseEvent<HTMLElement>) => void;
};

const AppButton = ({ label, style, rightIcon, onPress, loading = false }: Props) => {
  return (
    <Button
      onClick={onPress}
      sx={{
        ...style,
        border: `1.5px solid #5deddc`,
        ":hover": {
          backgroundColor: "fadedFlash",
          cursor: "pointer",
        },
      }}
    >
      {loading ? (
        <i className="fa fa-spinner fa-spin"></i>
      ) : (
        <>
          {label} {rightIcon}
        </>
      )}
    </Button>
  );
};

export default AppButton;
