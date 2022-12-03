import styled from "styled-components";

const Container = styled.div<{
  isOpen?: boolean;
}>`
  ${(props) =>
    props.isOpen
      ? `
          position: absolute;
          right: 30px;
          margin-top: 10px;
          top: 64px;
          width: fit-content;
          background-color: #fff;
          border-radius: 10px;
          height: auto;
          border: 1px solid #2e2c2c;
          width: 250px;
          padding: 10px;
        `
      : `
          display: none;
        `}
`;

interface FloatingMenuProps {
  isOpen: boolean;
  children: JSX.Element;
  // Transition props.
  transition?: {
    // How much does the Y position moves on animate.
    // Default is 20
    moveY?: number;
  };
}

const MenuOverlay: React.FC<FloatingMenuProps> = ({ isOpen, children }) => {
  return (
    <Container key={isOpen.toString()} isOpen={isOpen}>
      {children}
    </Container>
  );
};

export default MenuOverlay;
