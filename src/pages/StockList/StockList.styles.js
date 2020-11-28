import styled from 'styled-components';
import { Chip, flexColumnCenterX, BaseInput } from 'remember-ui';

export const Container = styled.div`
  ${flexColumnCenterX}
  padding:20px;
`;

export const List = styled.div`
  width: 100%;
`;

export const StockItem = styled.div`
  display: inline-block;
  margin: 5px;
  cursor: pointer;
  text-decoration: none;
`;

export const StockText = styled(Chip)``;

export const Input = styled.div`
  width: 100%;
`;

export const StockInput = styled(BaseInput)`
  width: 220px;
`;
