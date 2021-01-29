import React, { useState, useContext, useCallback } from 'react';
import dayjs from 'dayjs';

import NewLabelModal from './NewLabelModal/NewLabelModal';
import { StockContext } from 'context/StockContext';
import { TRELLO_LIST_ID } from 'constants/trello';
import { CalendarFormat } from 'constants/calendar';
import { LOCALE } from 'constants/locale';
import { createCard } from 'services/trello';
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
  alertPrice: '',
  alertPercent: '20',
};

const StockList = () => {
  const {
    state: { cardObjectList: cards, labelObjectList: labels, tagList },
    actions: { setCardObjectList },
  } = useContext(StockContext);

  const [isOpenNewLabelModal, setOpenNewLabelModal] = useState(false);
  const [isModificationMode, setModificationMode] = useState(false);
  const [stock, setStock] = useState({ ...stockDefaultValue });

  const addCardToTrello = () => {
    const {
      code,
      name,
      nation,
      userId,
      createdAt,
      tags,
      basePrice,
      alertPrice,
      alertPercent,
    } = stock;
    const _stock = [
      code,
      name,
      nation,
      userId,
      createdAt,
      '',
      tags,
      basePrice,
      alertPrice,
      alertPercent,
    ];
    createCard(_stock, TRELLO_LIST_ID, labels).then((res) => {
      if (res) {
        setStock({ ...stockDefaultValue });
        setCardObjectList([res, ...cards]);
      }
    });
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setStock((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const {
    name,
    code,
    nation,
    createdAt,
    basePrice,
    alertPrice,
    alertPercent,
  } = stock;

  return (
    <>
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
            theme="blue"
            onClick={() => {
              setOpenNewLabelModal(true);
            }}
            disabled={isModificationMode}
          >
            신규 태그 추가
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
            type="number"
            name="basePrice"
            placeholder="basePrice"
            maxLength={20}
            value={basePrice}
            onChange={handleChange}
            disabled={isModificationMode}
          />
          <StockInput
            type="text"
            name="alertPrice"
            placeholder="alertPrice"
            maxLength={20}
            value={alertPrice}
            onChange={handleChange}
            disabled={isModificationMode}
          />
          <StockInput
            type="number"
            name="alertPercent"
            placeholder="alertPercent"
            maxLength={3}
            value={alertPercent}
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
          setCards={setCardObjectList}
        />
      </Container>
      {isOpenNewLabelModal && (
        <NewLabelModal
          isOpenNewLabelModal={isOpenNewLabelModal}
          setOpenNewLabelModal={setOpenNewLabelModal}
        />
      )}
    </>
  );
};

export default StockList;
