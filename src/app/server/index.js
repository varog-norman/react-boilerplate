import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

import App from '../client/app';
import HTML from './template';

import { Page1 } from 'containers/Application';

const Routes = [
  {
    path: '/',
    exact: true,
    component: Page1,
    fetchData: Page1.fetchData
  }
]

export default function runServer({clientStats, serverStats}) {

  async function render(req, res, next) {
    const context = {};

    const currentRoute = Routes.find(route => matchPath(req.url, route)) || {};
    const fetchedData = await new Promise(resolve => {
      return (currentRoute.fetchData ? currentRoute.fetchData() : Promise.resolve({}))
        .then(resolve)
    })

    const renderAdditionalProps = {}

    if (fetchedData.data) {
      renderAdditionalProps.routeData = JSON.stringify({data: fetchedData.data});
      context.data = fetchedData.data;
    }

    res
      .status(200)
      .send(
        renderToString(
          <HTML
            assets={clientStats.assetsByChunkName.main}
            {...renderAdditionalProps}
          >
            <StaticRouter location={req.url} context={context}>
              <App />
            </StaticRouter>
          </HTML>
        )
      );
  }

  return async function(req, res, next) {
    try {
      await render(req, res, next)
    } catch (err) {
      console.log('Server render error', err)
      return res.send(`
        <div>
          <strong>Error during server side render.</strong>
          <hr/>
          <div>
            ${err.toString()}
          </div>
        </div>
      `)
    }
  }
}