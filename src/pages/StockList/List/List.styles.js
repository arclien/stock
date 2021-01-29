import styled from 'styled-components';
import { flexContainer } from 'remember-ui';

export const Container = styled.div`
  ${flexContainer('flex-start', '', 'row')};
  width: 100%;
`;

export const StockList = styled.div`
  margin-right: 50px;
  &:last-child {
    margin-left: 50px;
    margin-right: 0px;
  }
`;
