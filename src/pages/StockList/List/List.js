import React, { useState, useEffect } from 'react';
import { ConfirmModal } from 'remember-ui';

import { deleteCardById } from 'services/trello';
import { LOCALE } from 'constants/locale';
import Item from '../Item/Item';

import { Container, StockList } from './List.styles';

const List = ({ cards, isModificationMode, setCards, labels }) => {
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentCard, setCurrentCard] = useState({});
  const [koCards, setKoCards] = useState([]);
  const [usCards, setUsCards] = useState([]);

  useEffect(() => {
    const _koCards = cards.filter(
      (card) => JSON.parse(card.desc).nation === LOCALE.KO
    );
    setKoCards(_koCards);
    const _usCards = cards.filter(
      (card) => JSON.parse(card.desc).nation === LOCALE.US
    );
    setUsCards(_usCards);
  }, [cards]);

  return (
    <Container>
      <StockList>
        {koCards?.map((card) => (
          <Item
            key={card.id}
            card={card}
            isModificationMode={isModificationMode}
            setCurrentCard={setCurrentCard}
            setOpenDeleteModal={setOpenDeleteModal}
            setKoCards={setKoCards}
            koCards={koCards}
            labels={labels}
          />
        ))}
      </StockList>
      <StockList>
        {usCards?.map((card) => (
          <Item
            key={card.id}
            card={card}
            isModificationMode={isModificationMode}
            setCurrentCard={setCurrentCard}
            setOpenDeleteModal={setOpenDeleteModal}
            setUsCards={setUsCards}
            usCards={usCards}
            labels={labels}
          />
        ))}
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
