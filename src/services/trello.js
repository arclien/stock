import {
  getTrello,
  getColletionTrello,
  addCardUITrello,
  postTrello,
} from 'services/trelloApi';
import { TRELLO_COLLECTION_TYPE } from 'constants/trello';

export const getMe = (callback) => {
  getTrello('members/me', callback);
};

export const getMyBoards = (callback) => {
  getTrello('members/me/boards', callback);
};

/** 
################ Get from board
* */
export const getListsOnBoard = (callback, listId, field = 'all') => {
  getTrello(`boards/${listId}/lists/${field}`, callback);
};

export const getLabelsOnBoard = (callback, listId) => {
  getTrello(`boards/${listId}/labels`, callback);
};

export const getCardsOnBoard = (callback, listId, field = 'all') => {
  getTrello(`boards/${listId}/cards/${field}`, callback);
};

export const getCardOnBoardById = (callback, listId, cardId) => {
  getTrello(`boards/${listId}/cards/${cardId}`, callback);
};

/** 
################ Get by id
* */
export const getCardById = (callback, cardId) => {
  getColletionTrello(TRELLO_COLLECTION_TYPE.CARDS, cardId, callback);
};

export const getListById = (callback, listId) => {
  getColletionTrello(TRELLO_COLLECTION_TYPE.LISTS, listId, callback);
};

export const addCardUI = (source, name, idList, idBoard) => {
  addCardUITrello(source, name, idList, idBoard);
};

export const createCard = (listId) => {
  const newCard = {
    name: 'New Test Card',
    desc: 'This is the description of our new card.',
    idList: listId,
    pos: 'top',
  };

  postTrello(
    'cards',
    (res) => {
      console.log(res);
    },
    newCard
  );
};
