import React, { useState } from 'react';
import TrelloClient from 'react-trello-client';

import { TRELLO_API_KEY } from 'constants/trello';

const TrelloClientComponent = () => {
  const [isAuthoirzed, setAuthorized] = useState(false);

  const onSuccess = () => {
    setAuthorized(true);
  };
  const onError = () => {
    setAuthorized(false);
  };
  return (
    <>
      {!isAuthoirzed && (
        <TrelloClient
          apiKey={TRELLO_API_KEY} // Get the API key from https://trello.com/app-key/
          clientVersion={1} // number: {1}, {2}, {3}
          apiEndpoint="https://api.trello.com" // string: "https://api.trello.com"
          authEndpoint="https://trello.com" // string: "https://trello.com"
          intentEndpoint="https://trello.com" // string: "https://trello.com"
          authorizeName="Stock Dev" // string: "React Trello Client"
          authorizeType="popup" // string: popup | redirect
          authorizePersist
          authorizeInteractive
          authorizeScopeRead={false} // boolean: {true} | {false}
          authorizeScopeWrite // boolean: {true} | {false}
          authorizeScopeAccount={false} // boolean: {true} | {false}
          authorizeExpiration="never" // string: "1hour", "1day", "30days" | "never"
          authorizeOnSuccess={onSuccess} // function: {() => console.log('Login success!')}
          authorizeOnError={onError} // function: {() => console.log('Login error!')}
          autoAuthorize // boolean: {true} | {false}
          authorizeButton // boolean: {true} | {false}
          buttonStyle="flat" // string: "metamorph" | "flat"
          buttonColor="green" // string: "green" | "grayish-blue" | "light"
          buttonText="Login with Trello"
        />
      )}
    </>
  );
};

export default TrelloClientComponent;
