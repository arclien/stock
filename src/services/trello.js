import { getRandomInt } from 'utils/utils';
import { getTrello, getColletionTrello, postTrello } from 'services/trelloApi';
import {
  TRELLO_COLLECTION_TYPE,
  TRELLO_LABEL_COLOR,
  TRELLO_BOARD_STUDY_ID,
} from 'constants/trello';

export const getMe = () => {
  return getTrello('members/me');
};

export const getMyBoards = () => {
  return getTrello('members/me/boards');
};

/** 
################ Get from board
* */
export const getListsOnBoard = (listId, field = 'all') => {
  return getTrello(`boards/${listId}/lists/${field}`);
};

export const getLabelsOnBoard = (listId) => {
  return getTrello(`boards/${listId}/labels`);
};

export const getCardsOnBoard = (listId, field = 'all') => {
  return getTrello(`boards/${listId}/cards/${field}`);
};

export const getCardOnBoardById = (listId, cardId) => {
  return getTrello(`boards/${listId}/cards/${cardId}`);
};

/** 
################ Get collections by id
* */
export const getCardById = (cardId) => {
  return getColletionTrello(TRELLO_COLLECTION_TYPE.CARDS, cardId);
};

export const getListById = (listId) => {
  return getColletionTrello(TRELLO_COLLECTION_TYPE.LISTS, listId);
};

export const createLabel = async (tagName, idBoard) => {
  const index = getRandomInt(0, TRELLO_LABEL_COLOR.length);
  const newLabel = {
    name: tagName,
    color: TRELLO_LABEL_COLOR[index],
    idBoard,
  };
  const res = await postTrello('labels', newLabel);
  return res;
};

export const createCard = async (stock, idList, labels) => {
  if (!stock) return;

  const code = stock[0];
  const name = stock[1];
  const nation = stock[2];
  const created_at = stock[4];
  const updated_at = stock[5];
  const tags = stock[6].split('/');
  const base_price = stock.length === 8 ? stock[7] : '';

  const idLabels = [];
  await tags.forEach(async (tag) => {
    const label = labels.find((_label) => _label.name.trim() === tag.trim());
    if (label) {
      idLabels.push(label.id);
    }
  });

  const desc = {
    code,
    name,
    nation,
    created_at,
    base_price,
  };

  const newCard = {
    idList,
    name,
    desc: JSON.stringify(desc),
    pos: 'top',
    due: updated_at ? new Date(updated_at).toISOString() : '',
    idLabels: idLabels.toString(),
  };
  await postTrello('cards', newCard);
};
