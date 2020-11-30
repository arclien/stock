/* global fetch */

class Trello {
  constructor(key, token) {
    this.key = key;
    this.token = token;
  }

  auth(opts) {
    const name = (opts.name || 'My App').replace(/ /g, '+');
    const expiration = opts.expiration || '1hour';
    const scope = opts.scope || { read: true, write: true, account: false };

    return new Promise((resolve, reject) => {
      const { protocol, host, pathname, search } = window.location;
      const popup = window.open(
        `https://trello.com/1/authorize?response_type=token&key=${
          this.key
        }&return_url=${protocol}//${host}${pathname}${search}&callback_method=postMessage&scope=${Object.keys(
          scope
        )
          .filter((k) => scope[k])
          .join(',')}&expiration=${expiration}&name=${name}`,
        'trello',
        `height=606,width=405,left=${
          window.screenX + (window.innerWidth - 420) / 2
        },right=${window.screenY + (window.innerHeight - 470) / 2}`
      );

      const timeout = setTimeout(() => {
        popup.close();
        reject(new Error('Trello pop-up closed.'));
      }, 60000);

      const popupTick = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupTick);
          reject(new Error('Trello pop-up closed.'));
        }
      }, 500);

      window.addEventListener('message', (e) => {
        if (typeof e.data === 'string') {
          clearTimeout(timeout);
          popup.close();
          this.token = e.data;
          localStorage.setItem('trello_token', e.data);
          resolve();
        }
      });
    });
  }

  req(method, path, data) {
    data = data || {};
    data.key = this.key;
    data.token = this.token;
    const qs = new URLSearchParams();
    for (const k in data) {
      qs.append(k, data[k]);
    }

    const init = {
      method,
    };

    let url = `https://api.trello.com${path}`;

    if (method === 'POST' || method === 'PUT') {
      init.body = qs.toString();
      init.headers = {
        'Content-type': 'application/x-www-form-urlencoded',
      };
    } else {
      url += `?${qs.toString()}`;
    }

    return fetch(url, init).then((r) => r.json());
  }

  get(path, data) {
    return this.req('GET', path, data);
  }

  head(path, data) {
    return this.req('HEAD', path, data);
  }

  post(path, data) {
    return this.req('POST', path, data);
  }

  put(path, data) {
    return this.req('PUT', path, data);
  }
}

module.exports = Trello;
