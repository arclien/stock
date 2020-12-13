import styled, { css } from 'styled-components';
import { gray80, red100, font, BaseInput } from 'remember-ui';

export const Container = styled.div`
  max-height: 60vh;
  padding: 30px;
  border-top: 1px solid ${gray80};
`;

export const LabelInput = styled(BaseInput)`
  ${({ isLabelExists }) =>
    isLabelExists &&
    css`
      border: 1px solid ${red100};
      border-radius: 4px;
    `};
`;

export const ErrorText = styled.div`
  ${font({ size: '12px', color: red100 })};
`;
