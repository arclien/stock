import styled from 'styled-components';
import { flexCenterX, Radio, MaskingInput } from 'remember-ui';

export const Container = styled.div`
  ${flexCenterX}

  align-items: center;
`;

export const DateInput = styled(MaskingInput)`
  padding: 0px 10px;
`;

export const OffsetContainer = styled.div`
  ${flexCenterX}
  padding:20px;
`;

export const OffsetDate = styled(Radio)``;
