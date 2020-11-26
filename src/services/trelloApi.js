import { Trello } from 'react-trello-client';

import { TRELLO_COLLECTION_TYPE } from 'constants/trello';

const onSuccess = (res) => {
  return res;
};

const onError = (res) => {
  console.error(res);
};

export const getTrello = (path, callback = onSuccess, params = {}) => {
  Trello.get(path, params, callback, onError);
};

export const postTrello = (path, callback = onSuccess, params = {}) => {
  Trello.post(path, params, callback, onError);
};

export const putTrello = (path, callback = onSuccess, params = {}) => {
  Trello.put(path, params, callback, onError);
};

export const deleteTrello = (path, callback = onSuccess, params = {}) => {
  Trello.delete(path, params, callback, onError);
};

export const getColletionTrello = (
  type,
  id,
  callback = onSuccess,
  params = {}
) => {
  switch (type) {
    case TRELLO_COLLECTION_TYPE.ACTIONS:
      return Trello.actions.get(id, params, callback, onError);
    case TRELLO_COLLECTION_TYPE.CARDS:
      return Trello.cards.get(id, params, callback, onError);
    case TRELLO_COLLECTION_TYPE.CHECKLISTS:
      return Trello.checklists.get(id, params, callback, onError);
    case TRELLO_COLLECTION_TYPE.BOARDS:
      return Trello.boards.get(id, params, callback, onError);
    case TRELLO_COLLECTION_TYPE.LISTS:
      return Trello.lists.get(id, params, callback, onError);
    case TRELLO_COLLECTION_TYPE.ORGANIZATIONS:
      return Trello.organizations.get(id, params, callback, onError);
    default:
      return null;
  }
};
