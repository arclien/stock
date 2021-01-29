import React, { useCallback } from 'react';

import { updateCard } from 'services/trello';
import { LOCALE } from 'constants/locale';
import TagDropdown from '../components/TagDropdown/TagDropdown';

import {
  StockItem,
  Tag,
  StockInput,
  DeleteButton,
  ModifyButton,
} from './Item.styles';

const VisibleKey = [
  'name',
  'base_price',
  'alert_price',
  'alert_percent',
  'tag',
];
const EditableKey = ['base_price', 'alert_price', 'alert_percent'];

const getWidth = (key) => {
  if (key === 'alert_price') return '150px';
  if (key === 'alert_percent') return '60px';
  return '100px';
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
}) => {
  const handleChange = useCallback(
    (e, id, desc) => {
      const { name, value } = e.target;
      if (EditableKey.includes(name)) {
        const _desc = { ...JSON.parse(desc), [`${name}`]: value };
        if (_desc.nation === LOCALE.KO) {
          setKoCards((cards) =>
            cards.map((el) =>
              el.id === id ? { ...el, desc: JSON.stringify(_desc) } : el
            )
          );
        } else {
          setUsCards((cards) =>
            cards.map((el) =>
              el.id === id ? { ...el, desc: JSON.stringify(_desc) } : el
            )
          );
        }
      }
    },
    [setKoCards, setUsCards]
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
            {VisibleKey.includes(key) && (
              <StockInput
                width={getWidth(key)}
                key={key}
                type={
                  EditableKey.includes(key) && key !== 'alert_price'
                    ? 'number'
                    : 'text'
                }
                name={key}
                placeholder={key}
                maxLength={20}
                value={JSON.parse(card.desc)[key]}
                onChange={(e) => {
                  handleChange(e, card.id, card.desc);
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

      {isModificationMode && <TagDropdown card={card} addTags={addTags} />}

      {isModificationMode && (
        <>
          <DeleteButton
            onClick={() => {
              setCurrentCard(card);
              setOpenDeleteModal(true);
            }}
          />

          <ModifyButton onClick={() => updateCard(card)} />
        </>
      )}
    </StockItem>
  );
};
export default React.memo(Item);
