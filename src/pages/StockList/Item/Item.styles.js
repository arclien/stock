import styled from 'styled-components';
import {
  Chip,
  font,
  BaseInput,
  flexContainer,
  text,
  gray100,
  white,
  NewBaseButton,
} from 'remember-ui';

export const StockItem = styled.div`
  ${flexContainer('flex-start', 'center', 'row')};
  margin: 5px;
  border: 1px solid ${gray100};
  position: relative;
`;

export const Tag = styled(Chip)`
  ${font({ size: '11px', color: white, weight: 'bold' })};
  background-color: ${({ color }) =>
    (color === 'green' && '#61bd4f') ||
    (color === 'yellow' && '#f2d600') ||
    (color === 'orange' && '#ff9f1a') ||
    (color === 'red' && '#eb5a46') ||
    (color === 'purple' && '#c377e0') ||
    (color === 'blue' && '#0079bf') ||
    (color === 'sky' && '#00c2e0') ||
    (color === 'lime' && '#51e898') ||
    (color === 'pink' && '#ff78cb') ||
    (color === 'black' && '#344563')};

  border: 1px solid rgb(238, 238, 238);
  border-radius: 8px;
  margin-right: 2px;
  padding: 4px;
  height: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

export const StockInput = styled(BaseInput)`
  ${font({ size: '11px', color: text })};

  width: ${({ width }) => width};
  margin-right: 3px;
  > input {
    text-align: center;
    padding: 5px;
    height: 40px;
    border: 0px;
  }
`;

export const DeleteButton = styled(NewBaseButton)`
  position: absolute;
  right: -100px;
  height: 100%;
  padding: 0px;
`;

export const ModifyButton = styled(NewBaseButton)`
  position: absolute;
  right: -170px;
  height: 100%;
`;
