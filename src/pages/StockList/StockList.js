import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';

import { StockContext } from 'context/StockContext';
import {
  // TRELLO_CARD_ID,
  TRELLO_LIST_ID,
  TRELLO_BOARD_STUDY_ID,
} from 'constants/trello';
import { CalendarFormat } from 'constants/calendar';
import { LOCALE } from 'constants/locale';
import {
  // getMe,
  // getMyBoards,
  // getListsOnBoard,
  getLabelsOnBoard,
  getCardsOnBoard,
  // getCardOnBoardById,
  // getCardById,
  // getListById,
  // createLabel,
  createCard,
} from 'services/trello';

import {
  AddButton,
  Container,
  List,
  StockItem,
  StockText,
  Input,
  StockInput,
  Dropdown,
  DropdownList,
  DropdownText,
} from './StockList.styles';

const stockDefaultValue = {
  name: '',
  code: '',
  nation: LOCALE.KO,
  userId: '1',
  createdAt: dayjs(new Date()).format(CalendarFormat),
  tags: '',
  basePrice: '',
};

const StockList = () => {
  const {
    state: { tagList },
  } = useContext(StockContext);

  const [cards, setCards] = useState([]);
  const [labels, setLabels] = useState([]);
  const [stock, setStock] = useState({ ...stockDefaultValue });

  useEffect(() => {
    (async function searchStockList() {
      const _cards = await getCardsOnBoard(TRELLO_BOARD_STUDY_ID);
      setCards(_cards);
      const _labels = await getLabelsOnBoard(TRELLO_BOARD_STUDY_ID);
      setLabels(_labels);
    })();
  }, []);

  const addCardToTrello = () => {
    const { code, name, nation, userId, createdAt, tags, basePrice } = stock;
    const _stock = [code, name, nation, userId, createdAt, '', tags, basePrice];
    createCard(_stock, TRELLO_LIST_ID, labels).then((res) => {
      if (res) setStock({ ...stockDefaultValue });
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { name, code, nation, createdAt, basePrice } = stock;

  return (
    <Container>
      <AddButton onClick={addCardToTrello} disabled={!name || !code}>
        AddCARD
      </AddButton>
      <Input>
        <StockInput
          type="text"
          name="code"
          placeholder="종목코드"
          maxLength={20}
          value={code}
          onChange={handleChange}
        />
        <StockInput
          type="text"
          name="name"
          placeholder="종목이름"
          maxLength={20}
          value={name}
          onChange={handleChange}
        />
        <Dropdown
          size="medium"
          placement="bottom-start"
          content={
            <div>
              {Object.keys(LOCALE).map((_nation) => (
                <DropdownList
                  key={_nation}
                  onClick={() => {
                    setStock((prevState) => ({
                      ...prevState,
                      nation: LOCALE[_nation],
                    }));
                  }}
                >
                  {LOCALE[_nation]}
                </DropdownList>
              ))}
            </div>
          }
        >
          <DropdownText> {nation || LOCALE.KO}</DropdownText>
        </Dropdown>

        <StockInput
          type="text"
          name="createdAt"
          placeholder="추가날짜"
          maxLength={20}
          value={createdAt}
          onChange={handleChange}
          readOnly
        />
        <StockInput
          type="text"
          name="basePrice"
          placeholder="basePrice"
          maxLength={20}
          value={basePrice}
          onChange={handleChange}
        />
        <Dropdown
          size="medium"
          placement="bottom-start"
          content={
            <div>
              {tagList.map((tag) => (
                <DropdownList
                  key={tag}
                  onClick={() => {
                    setStock((prevState) => ({
                      ...prevState,
                      tags: prevState.tags
                        ? `${prevState.tags}/${tag}`
                        : `${tag}`,
                    }));
                  }}
                >
                  {tag}
                </DropdownList>
              ))}
            </div>
          }
        >
          <DropdownText>태그 추가</DropdownText>
        </Dropdown>
        {stock.tags &&
          stock.tags
            .split('/')
            .map((tag) => <StockText key={tag}>{tag}</StockText>)}
      </Input>
      <List>
        {cards?.map((card) => (
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
                  onChange={handleChange}
                  disabled
                />
              );
            })}
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
