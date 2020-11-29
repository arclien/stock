import styled from 'styled-components';
import {
  font,
  gray100,
  text,
  Chip,
  BaseInput,
  flexContainer,
  BasePopover,
  PopoverItem,
  NewBaseButton,
} from 'remember-ui';

export const Container = styled.div`
  ${flexContainer('flex-start', false, 'column')};

  padding: 20px;
`;

export const List = styled.div`
  width: 100%;
`;

export const StockItem = styled.div`
  ${flexContainer('flex-start', 'center', 'row')};
  margin: 5px;
`;

export const StockText = styled(Chip)``;

export const Input = styled.div`
  ${flexContainer('flex-start', 'center', 'row')};

  width: 100%;
`;

export const StockInput = styled(BaseInput)`
  width: 120px;
`;

export const Dropdown = styled(BasePopover)`
  height: 500px;
  max-height: 500px;
  overflow-y: scroll;
`;

export const DropdownList = styled(PopoverItem)``;

export const DropdownText = styled.div`
  width: 120px;
  font-size: 15px;
  color: ${text};
  height: 44px;
  border-radius: 4px;
  border: 1px solid ${gray100};
  padding: 11px 12px;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
`;

export const AddButton = styled(NewBaseButton)`
  ${font({ size: '15px', color: text })};

  width: 200px;
`;
