import React, { useState, useEffect } from 'react';
import { ConfirmModal } from 'remember-ui';

import { deleteCardById } from 'services/trello';

import {
  Container,
  StockList,
  StockItem,
  Tag,
  StockInput,
  DeleteButton,
} from './List.styles';

const renderItem = (card, isModificationMode, deleteStock) => (
  <StockItem key={card.id}>
    {Object.keys(JSON.parse(card.desc)).map((key) => {
      return (
        <StockInput
          key={key}
          type="text"
          name={key}
          placeholder={key}
          maxLength={20}
          value={JSON.parse(card.desc)[key]}
          onChange={() => {}}
          disabled={key !== 'base_price' || !isModificationMode}
        />
      );
    })}
    {card.labels.map((label) => (
      <Tag key={label.id}>{label.name}</Tag>
    ))}
    {isModificationMode && (
      <DeleteButton theme="red" size="small" onClick={() => deleteStock(card)}>
        삭제
      </DeleteButton>
    )}
  </StockItem>
);

const List = ({ cards, isModificationMode, setCards }) => {
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentCard, setCurrentCard] = useState({});
  const [koCards, setKoCards] = useState([]);
  const [usCards, setUsCards] = useState([]);

  useEffect(() => {
    const _koCards = cards.filter(
      (card) => JSON.parse(card.desc).nation === 'ko'
    );
    setKoCards(_koCards);
    const _usCards = cards.filter(
      (card) => JSON.parse(card.desc).nation === 'us'
    );
    setUsCards(_usCards);
  }, [cards]);

  const deleteStock = (card) => {
    setCurrentCard(card);
    setOpenDeleteModal(true);
  };

  return (
    <Container>
      <StockList>
        {koCards?.map((card) =>
          renderItem(card, isModificationMode, deleteStock)
        )}
      </StockList>
      <StockList>
        {usCards?.map((card) =>
          renderItem(card, isModificationMode, deleteStock)
        )}
      </StockList>
      {isOpenDeleteModal && (
        <ConfirmModal
          icon="warning"
          isOpen={isOpenDeleteModal}
          title={`${JSON.parse(currentCard.desc).name}을 삭제 하시겠습니까?`}
          type="delete"
          okText="삭제"
          onOk={() => {
            setCards(cards.filter((el) => el.id !== currentCard.id));
            deleteCardById(currentCard.id);
          }}
          onClose={() => setOpenDeleteModal(false)}
        />
      )}
    </Container>
  );
};

export default List;
