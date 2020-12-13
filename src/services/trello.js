import { getRandomInt } from 'utils/utils';
import {
  getTrello,
  getColletionTrello,
  deleteTrello,
  postTrello,
  putTrello,
} from 'services/trelloApi';
import {
  TRELLO_COLLECTION_TYPE,
  TRELLO_LABEL_COLOR,
  // TRELLO_BOARD_STUDY_ID,
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
export const getListsOnBoard = (boardId, field = 'all') => {
  return getTrello(`boards/${boardId}/lists/${field}`);
};

export const getLabelsOnBoard = (boardId) => {
  const params = {
    limit: 100,
  };
  return getTrello(`boards/${boardId}/labels`, params);
};

export const getCardsOnBoard = (boardId, field = 'all') => {
  return getTrello(`boards/${boardId}/cards/${field}`);
};

export const getCardOnBoardById = (boardId, cardId) => {
  return getTrello(`boards/${boardId}/cards/${cardId}`);
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
  const createdAt = stock[4];
  const tags = stock[6].split('/');
  const basePrice = stock.length === 8 ? stock[7] : '';

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
    created_at: createdAt,
    base_price: basePrice,
  };

  const newCard = {
    idList,
    name,
    desc: JSON.stringify(desc),
    pos: 'top',
    idLabels: idLabels.toString(),
  };
  return postTrello('cards', newCard);
};

export const updateCard = async (stock) => {
  if (!stock) return;

  const { id, desc, idLabels } = stock;
  const card = {
    desc,
    idLabels,
  };
  return putTrello(`${TRELLO_COLLECTION_TYPE.CARDS}/${id}`, card);
};

/** 
################ delete collections by id
* */
export const deleteCardById = (cardId) => {
  return deleteTrello(`${TRELLO_COLLECTION_TYPE.CARDS}/${cardId}`);
};
