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
import List from './List/List';

import {
  Buttons,
  AddButton,
  Container,
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
    state: { tagList, hasTrelloToken },
  } = useContext(StockContext);

  const [isModificationMode, setModificationMode] = useState(false);
  const [cards, setCards] = useState([]);
  const [labels, setLabels] = useState([]);
  const [stock, setStock] = useState({ ...stockDefaultValue });

  useEffect(() => {
    (async () => {
      if (hasTrelloToken) {
        const _cards = await getCardsOnBoard(TRELLO_BOARD_STUDY_ID);
        setCards(_cards);
        const _labels = await getLabelsOnBoard(TRELLO_BOARD_STUDY_ID);
        setLabels(_labels);
      }
    })();
  }, [hasTrelloToken]);

  const addCardToTrello = () => {
    const { code, name, nation, userId, createdAt, tags, basePrice } = stock;
    const _stock = [code, name, nation, userId, createdAt, '', tags, basePrice];
    createCard(_stock, TRELLO_LIST_ID, labels).then((res) => {
      if (res) {
        setStock({ ...stockDefaultValue });
        setCards([res, ...cards]);
      }
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
      <Buttons>
        <AddButton
          theme="blue"
          onClick={addCardToTrello}
          disabled={!name || !code || isModificationMode}
        >
          신규 종목 추가
        </AddButton>
        <AddButton
          theme="red"
          onClick={() => {
            setModificationMode(!isModificationMode);
          }}
        >
          {isModificationMode ? '종목 수정 모드' : '종목 읽기 모드'}
        </AddButton>
      </Buttons>
      <Input>
        <StockInput
          type="text"
          name="code"
          placeholder="종목코드"
          maxLength={20}
          value={code}
          onChange={handleChange}
          disabled={isModificationMode}
        />
        <StockInput
          type="text"
          name="name"
          placeholder="종목이름"
          maxLength={20}
          value={name}
          onChange={handleChange}
          disabled={isModificationMode}
        />
        <Dropdown
          disabled={isModificationMode}
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
          disabled={isModificationMode}
        />
        <StockInput
          type="text"
          name="basePrice"
          placeholder="basePrice"
          maxLength={20}
          value={basePrice}
          onChange={handleChange}
          disabled={isModificationMode}
        />
        <Dropdown
          disabled={isModificationMode}
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
      <List
        cards={cards}
        isModificationMode={isModificationMode}
        setCards={setCards}
      />
    </Container>
  );
};

export default StockList;
