import styled, { css } from 'styled-components';
import {
  flexCenter,
  Radio,
  MaskingInput,
  flexCenterY,
  NewBaseButton,
  font,
  text,
  gray100,
  yellow100,
} from 'remember-ui';

export const Container = styled.div`
  ${flexCenterY}

  width:100%;
  justify-content: space-between;
`;

export const CalendarContainer = styled.div`
  ${flexCenter}
`;

export const DateInput = styled(MaskingInput)`
  padding: 0px 10px;
`;

export const OffsetContainer = styled.div`
  ${flexCenter}
  padding:20px;
`;

export const RadioButton = styled(NewBaseButton)`
  ${font({ size: '15px', color: text })}

  ${({ isChecked }) =>
    isChecked &&
    css`
      background-color: ${yellow100};
    `}

  border-radius:0px;
  border: 1px solid ${gray100};
`;

export const OffsetDate = styled(Radio)``;

export const Cursor = styled.div`
  cursor: pointer;
`;
