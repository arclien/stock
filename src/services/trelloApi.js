import { TRELLO_API_KEY } from 'constants/trello';
import Trello from 'Trello';

const MyTrello = new Trello(TRELLO_API_KEY);

export const authTrello = (callback) => {
  return Promise.resolve()
    .then(() => localStorage.getItem('trello_token'))
    .then((existingToken) => {
      if (existingToken) {
        MyTrello.token = existingToken;
        MyTrello.key = TRELLO_API_KEY;
      } else {
        return MyTrello.auth({
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
    .then(() => {
      return callback();
    })
    .catch(() => {
      // console.log(
      //   'something bad happened, or the user took too long to authorize.',
      //   e
      // );
    });
};

export const getTrello = (path, params = {}) => {
  return MyTrello.get(`/1/${path}`, params);
};

export const postTrello = (path, params = {}) => {
  return MyTrello.post(`/1/${path}`, params);
};

export const putTrello = (path, params = {}) => {
  return MyTrello.put(`/1/${path}`, params);
};

export const deleteTrello = (path, params = {}) => {
  return MyTrello.delete(`/1/${path}`, params);
};

export const getColletionTrello = (type, id, params = {}) => {
  return MyTrello.get(`/1/${type}/${id}`, params);
};
