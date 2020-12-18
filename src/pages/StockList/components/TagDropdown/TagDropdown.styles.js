import styled from 'styled-components';
import { font, text, gray100, BasePopover, PopoverItem } from 'remember-ui';

export const Dropdown = styled(BasePopover)`
  height: 300px;
  max-height: 300px;
  overflow-y: scroll;
`;

export const DropdownList = styled(PopoverItem)``;

export const DropdownText = styled.div`
  ${font({ size: '11px', color: text })};

  width: 35px;
  border-radius: 4px;
  border: 1px solid ${gray100};
  padding: 12px 6px;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0px;
`;
