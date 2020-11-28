import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';

import { StockContext } from 'context/StockContext';
import {
  TRELLO_CARD_ID,
  TRELLO_LIST_ID,
  TRELLO_BOARD_STUDY_ID,
} from 'constants/trello';
import { CalendarFormat } from 'constants/calendar';
import {
  getMe,
  getMyBoards,
  getListsOnBoard,
  getLabelsOnBoard,
  getCardsOnBoard,
  getCardOnBoardById,
  getCardById,
  getListById,
  createLabel,
  createCard,
} from 'services/trello';

import {
  Container,
  List,
  StockItem,
  StockText,
  Input,
  StockInput,
} from './StockList.styles';

const StockList = () => {
  const {
    state: { stockList },
  } = useContext(StockContext);

  const [cards, setCards] = useState([]);
  const [labels, setLabels] = useState([]);
  const [stock, setStock] = useState({
    name: '',
    code: '',
    nation: '',
    user_id: '1',
    tag_list: '',
    base_price: '',
  });

  useEffect(() => {
    (async function searchStockList() {
      const _cards = await getCardsOnBoard(TRELLO_BOARD_STUDY_ID);
      setCards(_cards);
      const _labels = await getLabelsOnBoard(TRELLO_BOARD_STUDY_ID);
      setLabels(_labels);
    })();
  }, [cards.length, stockList]);

  const addCardToTrello = () => {
    const { code, name, nation, user_id, tag_list, base_price } = stock;
    const _stock = [
      code,
      name,
      nation,
      user_id,
      dayjs(new Date()).format(CalendarFormat),
      '',
      tag_list,
      base_price,
    ];
    console.log(_stock);
    createCard(_stock, TRELLO_LIST_ID, labels);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Container>
      <div onClick={addCardToTrello}>AddCARD</div>
      <Input>
        <StockInput
          type="text"
          name="name"
          placeholder="종목이름"
          maxLength={20}
          value={stock.name}
          onChange={handleChange}
        />
        <StockInput
          type="text"
          name="code"
          placeholder="종목코드"
          maxLength={20}
          value={stock.code}
          onChange={handleChange}
        />
        <StockInput
          type="text"
          name="nation"
          placeholder="국가:ko / us"
          maxLength={20}
          value={stock.nation}
          onChange={handleChange}
        />
        <StockInput
          type="text"
          name="tag_list"
          placeholder="태그"
          maxLength={20}
          value={stock.tag_list}
          onChange={handleChange}
        />
        <StockInput
          type="text"
          name="base_price"
          placeholder="basePrice"
          maxLength={20}
          value={stock.base_price}
          onChange={handleChange}
        />
      </Input>
      <List>
        {cards?.map((card) => (
          <StockItem key={card.id}>
            {card.name}
            {card.desc}
            {card.labels.map((label) => (
              <StockText key={label.id}>{label.name}</StockText>
            ))}
          </StockItem>
        ))}
      </List>
    </Container>
  );
};

export default StockList;
