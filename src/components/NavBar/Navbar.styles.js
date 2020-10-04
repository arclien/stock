import styled, { css } from 'styled-components';
import { Chip, flexColumnCenterX } from 'remember-ui';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  ${flexColumnCenterX}
  padding:20px;
`;

export const StockList = styled.div``;
export const StockItem = styled(Link)`
  display: inline-block;
  margin: 5px;
  cursor: pointer;
  text-decoration: none;
`;
export const StockText = styled(Chip)`
  ${({ active }) =>
    active &&
    css`
      font-weight: bold;
    `}
  &:hover,
  &:focus {
    font-weight: bold;
  }
`;
