import React, { useCallback } from 'react';

import { updateCard } from 'services/trello';
import { LOCALE } from 'constants/locale';

import {
  StockItem,
  Tag,
  StockInput,
  DeleteButton,
  ModifyButton,
  Dropdown,
  DropdownList,
  DropdownText,
} from './Item.styles';

const EditableKey = ['base_price', 'alert_price', 'alert_percent'];

const getWidth = (key) => {
  if (key === 'code') return '65px';
  if (key === 'nation') return '40px';
  if (key === 'alert_percent') return '50px';
  return '90px';
};

const Item = ({
  card,
  isModificationMode,
  setCurrentCard,
  setOpenDeleteModal,
  setKoCards,
  setUsCards,
  koCards = [],
  usCards = [],
  labels,
}) => {
  const handleChange = useCallback(
    (e, card) => {
      const { name, value } = e.target;
      if (EditableKey.includes(name)) {
        const _card = { ...JSON.parse(card.desc), [`${name}`]: value };
        card.desc = JSON.stringify(_card);
        if (_card.nation === LOCALE.KO) {
          setKoCards([...koCards]);
        } else {
          setUsCards([...usCards]);
        }
      }
    },
    [koCards, setKoCards, setUsCards, usCards]
  );

  const addTags = useCallback(
    (label, card) => {
      if (card.idLabels.indexOf(label.id) >= 0) return;
      card.idLabels = [...card.idLabels, label.id];
      card.labels = [...card.labels, label];

      if (JSON.parse(card.desc).nation === LOCALE.KO) {
        setKoCards([...koCards]);
      } else {
        setUsCards([...usCards]);
      }
    },
    [koCards, setKoCards, setUsCards, usCards]
  );

  const removeTags = useCallback(
    (label, card) => {
      card.idLabels = [...card.idLabels.filter((el) => el !== label.id)];
      card.labels = [...card.labels.filter((el) => el.id !== label.id)];

      if (JSON.parse(card.desc).nation === LOCALE.KO) {
        setKoCards([...koCards]);
      } else {
        setUsCards([...usCards]);
      }
    },
    [koCards, setKoCards, setUsCards, usCards]
  );

  return (
    <StockItem key={card.id}>
      {Object.keys(JSON.parse(card.desc)).map((key) => {
        return (
          <>
            {key !== 'created_at' && (
              <StockInput
                width={getWidth(key)}
                key={key}
                type={EditableKey.includes(key) ? 'number' : 'text'}
                name={key}
                placeholder={key}
                maxLength={20}
                value={JSON.parse(card.desc)[key]}
                onChange={(e) => {
                  handleChange(e, card);
                }}
                disabled={!EditableKey.includes(key) || !isModificationMode}
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
            onClick={() => {
              setCurrentCard(card);
              setOpenDeleteModal(true);
            }}
          >
            삭제
          </DeleteButton>
          <ModifyButton
            theme="blue"
            size="small"
            onClick={() => updateCard(card)}
          >
            수정
          </ModifyButton>
        </>
      )}
    </StockItem>
  );
};
export default React.memo(Item);
