import React, { useState, useEffect } from 'react';

import { TRELLO_CARD_ID, TRELLO_BOARD_STUDY_ID } from 'constants/trello';
import { getCardsOnBoard, getMyBoards, getCardById } from 'services/trello';
import TrelloClientComponent from 'components/TrelloClient/TrelloClient';

const StockList = () => {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    const ab = (res) => {
      setCards(res);
    };
    // getCardById(ab, TRELLO_CARD_ID);
    getCardsOnBoard(ab, TRELLO_BOARD_STUDY_ID);
  }, []);
  console.log(cards);
  return (
    <>
      <TrelloClientComponent />
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
