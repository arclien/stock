import styled, { css } from 'styled-components';
import {
  Chip,
  flexColumnCenterX,
  textExtraLarge,
  gray400,
  BaseInput,
  font,
  gold200,
  mobileOnly,
} from 'remember-ui';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  ${flexColumnCenterX}
  padding:20px;
`;

export const StockList = styled.div`
  width: 100%;
`;
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

  ${mobileOnly(css`
    ${font({ size: '12px', color: gold200 })}
    padding: 5px;
    min-width: 40px;
  `)}
`;

export const PageTitle = styled.div`
  ${textExtraLarge({ color: gray400 })}
`;

export const SearchInput = styled(BaseInput)`
  width: 220px;
`;
