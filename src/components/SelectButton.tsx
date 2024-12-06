import { styled } from '@mui/material/styles';

interface SelectButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const StyledSpan = styled('span')<{ selected: boolean }>(({ selected }) => ({
  border: "1px solid gold",
  borderRadius: 5,
  padding: 10,
  paddingLeft: 20,
  paddingRight: 20,
  fontFamily: "Montserrat",
  cursor: "pointer",
  backgroundColor: selected ? "gold" : "",
  color: selected ? "black" : "",
  fontWeight: selected ? 700 : 500,
  "&:hover": {
    backgroundColor: "gold",
    color: "black",
  },
  width: "22%",
  //   margin: 5,
}));

const SelectButton: React.FC<SelectButtonProps> = ({ children, selected, onClick }) => {
  return (
    <StyledSpan selected={selected} onClick={onClick}>
      {children}
    </StyledSpan>
  );
};

export default SelectButton;