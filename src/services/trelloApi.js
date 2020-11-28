import { TRELLO_API_KEY } from 'constants/trello';

const TrelloWeb = require('trello-web');

const Trello = new TrelloWeb(TRELLO_API_KEY);

Promise.resolve()
  .then(() => localStorage.getItem('trello_token'))
  .then((existingToken) => {
    if (existingToken) {
      Trello.token = existingToken;
    } else {
      return Trello.auth({
        name: 'Stock App',
        scope: {
          read: true,
          write: true,
          account: true,
        },
        expiration: 'never',
      });
    }
  })
  .catch((e) => {
    console.log(
      'something bad happened, or the user took too long to authorize.',
      e
    );
  });

export const getTrello = (path, params = {}) => {
  return Trello.get(`/1/${path}`, params);
};

export const postTrello = (path, params = {}) => {
  return Trello.post(`/1/${path}`, params);
};

export const putTrello = (path, params = {}) => {
  return Trello.put(`/1/${path}`, params);
};

export const deleteTrello = (path, params = {}) => {
  return Trello.delete(`/1/${path}`, params);
};

export const getColletionTrello = (type, id, params = {}) => {
  return Trello.get(`/1/${type}/${id}`, params);
};
