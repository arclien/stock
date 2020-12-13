import React, { useState, useContext } from 'react';
import { DesignedModal } from 'remember-ui';

import { StockContext } from 'context/StockContext';
import { TRELLO_BOARD_STUDY_ID } from 'constants/trello';
import { createLabel } from 'services/trello';

import { Container, LabelInput, ErrorText } from './NewLabelModal.styles';

const NewLabelModal = ({ isOpenNewLabelModal, setOpenNewLabelModal }) => {
  const {
    state: { tagList },
    actions: { setTagList },
  } = useContext(StockContext);

  const [labelName, setLabelName] = useState('');
  const [isLabelExists, setLabelExists] = useState(false);

  const postLabel = async () => {
    await createLabel(labelName, TRELLO_BOARD_STUDY_ID);
    setTagList([labelName, ...tagList]);
    setOpenNewLabelModal(false);
  };

  return (
    <DesignedModal
      isOpen={isOpenNewLabelModal}
      onClose={() => setOpenNewLabelModal(false)}
      title="새로운 태그 추가"
      submit={postLabel}
      submitText="추가"
      submitButtonDisabled={!labelName || isLabelExists}
      close={() => setOpenNewLabelModal(false)}
      closeText="닫기"
    >
      <Container>
        <LabelInput
          autoFocus
          type="text"
          name="label"
          placeholder="태그"
          maxLength={20}
          value={labelName}
          onChange={({ target }) => {
            setLabelName(target.value.trim());
            const labelExists = tagList.indexOf(target.value.trim());
            setLabelExists(labelExists >= 0);
          }}
          isLabelExists={isLabelExists}
        />
        {isLabelExists && <ErrorText>이미 존재하는 태그입니다</ErrorText>}
      </Container>
    </DesignedModal>
  );
};

export default NewLabelModal;
