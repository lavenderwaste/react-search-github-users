import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

//dev-f3c4kuem.us.auth0.com //auth domain auth0
//NXh4EgmEEHKHbotZub0ER3G4gmj2bqHG //client id auth0

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-f3c4kuem.us.auth0.com' //in development is better to use the env variables
      clientId='NXh4EgmEEHKHbotZub0ER3G4gmj2bqHG'
      redirectUri={window.location.origin}
      cacheLocation='localstorage'>
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
