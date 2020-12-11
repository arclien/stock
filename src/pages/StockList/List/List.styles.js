import styled from 'styled-components';
import {
  Chip,
  font,
  BaseInput,
  flexContainer,
  text,
  gray100,
  NewBaseButton,
} from 'remember-ui';

export const Container = styled.div`
  ${flexContainer('space-between', '', 'row')};
  width: 100%;
`;

export const StockList = styled.div``;
export const StockItem = styled.div`
  ${flexContainer('flex-start', 'center', 'row')};
  margin: 5px;
  border: 1px solid ${gray100};
  position: relative;
`;

export const Tag = styled(Chip)``;

export const StockInput = styled(BaseInput)`
  ${font({ size: '11px', color: text })};

  width: 90px;
  margin-right: 3px;
  > input {
    padding: 5px;
    height: 40px;
    border: 0px;
  }
`;

export const DeleteButton = styled(NewBaseButton)`
  position: absolute;
  right: 0px;
  height: 100%;
`;
