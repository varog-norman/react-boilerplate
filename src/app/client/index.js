import React from 'react';
import { hydrate } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import { getCookie } from 'helpers';
import { localizationData } from 'intl/setup';

import App from './app';

if (typeof window !== 'undefined') {
  var container = document.getElementById('root');
}

const locale = getCookie('lang') || 'en';

const render = () => hydrate(
  <IntlProvider
    textComponent={React.Fragment}
    locale={locale}
    messages={localizationData[locale].messages}
  >
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </IntlProvider>,
  container,
);

render();