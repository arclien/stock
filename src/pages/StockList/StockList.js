import React, { useState, useEffect } from 'react';

import {
  TRELLO_CARD_ID,
  TRELLO_LIST_ID,
  TRELLO_BOARD_STUDY_ID,
} from 'constants/trello';
import {
  getListsOnBoard,
  getCardsOnBoard,
  getMyBoards,
  getCardById,
  createCard,
  addCardUI,
} from 'services/trello';
import TrelloClientComponent from 'components/TrelloClient/TrelloClient';

const StockList = () => {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    const ab = (res) => {
      setCards(res);
    };
    // getCardById(ab, TRELLO_CARD_ID);
    // getListsOnBoard(ab, TRELLO_BOARD_STUDY_ID);
    getCardsOnBoard(ab, TRELLO_BOARD_STUDY_ID);
  }, []);
  console.log(cards);

  const addCardToTrello = () => {
    createCard(TRELLO_LIST_ID);
    // addCardUI(
    //   'http://localhost:3000/',
    //   'Test',
    //   TRELLO_LIST_ID,
    //   TRELLO_BOARD_STUDY_ID
    // );
  };
  return (
    <>
      <TrelloClientComponent />
      <div onClick={addCardToTrello}>add</div>
      {cards.map((card) => (
        <div>
          {card.name}
          {card.desc}
          {card.labels.map((label) => (
            <div>{label.name}</div>
          ))}
        </div>
      ))}
    </>
  );
};

export default StockList;
