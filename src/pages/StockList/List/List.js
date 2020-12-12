import React, { useState, useEffect } from 'react';
import { ConfirmModal } from 'remember-ui';

import { deleteCardById, updateCard } from 'services/trello';

import {
  Container,
  StockList,
  StockItem,
  Tag,
  StockInput,
  DeleteButton,
  ModifyButton,
  Dropdown,
  DropdownList,
  DropdownText,
} from './List.styles';

const getWidth = (key) => {
  if (key === 'code') return '65px';
  if (key === 'nation') return '40px';
  return '90px';
};

const renderItem = (
  card,
  isModificationMode,
  deleteStock,
  handleChange,
  addTags,
  removeTags,
  labels
) => (
  <StockItem key={card.id}>
    {Object.keys(JSON.parse(card.desc)).map((key) => {
      return (
        <>
          {key !== 'created_at' && (
            <StockInput
              width={getWidth(key)}
              key={key}
              type={key === 'base_price' ? 'number' : 'text'}
              name={key}
              placeholder={key}
              maxLength={20}
              value={JSON.parse(card.desc)[key]}
              onChange={(e) => {
                handleChange(e, card);
              }}
              disabled={key !== 'base_price' || !isModificationMode}
            />
          )}
        </>
      );
    })}
    {card.labels.map((label) => (
      <Tag
        key={label.id}
        color={label.color}
        disabled={!isModificationMode}
        onClick={() => {
          if (isModificationMode) removeTags(label, card);
        }}
      >
        {label.name}
      </Tag>
    ))}

    {isModificationMode && (
      <Dropdown
        size="medium"
        placement="bottom-start"
        content={
          <div>
            {labels.map((label) => (
              <DropdownList
                key={label.id}
                onClick={() => {
                  addTags(label, card);
                }}
              >
                {label.name}
              </DropdownList>
            ))}
          </div>
        }
      >
        <DropdownText>태그</DropdownText>
      </Dropdown>
    )}

    {isModificationMode && (
      <>
        <DeleteButton
          theme="red"
          size="small"
          onClick={() => deleteStock(card)}
        >
          삭제
        </DeleteButton>
        <ModifyButton
          theme="blue"
          size="small"
          onClick={() => updateCard(card, labels)}
        >
          수정
        </ModifyButton>
      </>
    )}
  </StockItem>
);

const List = ({ cards, isModificationMode, setCards, labels }) => {
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

  const handleChange = (e, card) => {
    const { name, value } = e.target;
    if (name === 'base_price') {
      const _card = { ...JSON.parse(card.desc), base_price: value };
      card.desc = JSON.stringify(_card);
      if (_card.nation === 'ko') {
        setKoCards([...koCards]);
      } else {
        setUsCards([...usCards]);
      }
    }
  };

  const addTags = (label, card) => {
    if (card.idLabels.indexOf(label.id) >= 0) return;
    card.idLabels = [...card.idLabels, label.id];
    card.labels = [...card.labels, label];

    if (card.nation === 'ko') {
      setKoCards([...koCards]);
    } else {
      setUsCards([...usCards]);
    }
  };

  const removeTags = (label, card) => {
    card.idLabels = [...card.idLabels.filter((el) => el !== label.id)];
    card.labels = [...card.labels.filter((el) => el.id !== label.id)];

    if (card.nation === 'ko') {
      setKoCards([...koCards]);
    } else {
      setUsCards([...usCards]);
    }
  };

  return (
    <Container>
      <StockList>
        {koCards?.map((card) =>
          renderItem(
            card,
            isModificationMode,
            deleteStock,
            handleChange,
            addTags,
            removeTags,
            labels
          )
        )}
      </StockList>
      <StockList>
        {usCards?.map((card) =>
          renderItem(
            card,
            isModificationMode,
            deleteStock,
            handleChange,
            addTags,
            removeTags,
            labels
          )
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
