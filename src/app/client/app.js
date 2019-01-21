import React from 'react';
import { hot } from 'react-hot-loader';

import Application from 'containers/Application';

import { afterStartApplication } from 'helpers';
import { IS_DEV } from 'constants';

class App extends React.Component {

  constructor(props) {
    super(props);

    afterStartApplication();
  }

  render() {
    return (
      <Application />
    )
  }
}

export default IS_DEV ? hot(module)(App) : App;