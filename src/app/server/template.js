import React, { Component } from 'react';

function getAssets(assetsArr) {
  const assets = {
    styles: [],
    scripts: []
  }

  assetsArr.forEach(el => {
    if (new RegExp(/^\/?style.+\.css$/).test(el)) {
      assets.styles.push(el.replace('/', ''));
    }

    if (new RegExp(/^\/?client.+\.js$/).test(el)) {
      assets.scripts.push(el.replace('/', ''));
    }
  });

  return assets;
}

export default class HTML extends Component {

  render() {
    const {
      assets: assetsLinks = [],
      routeData = null,
      children
    } = this.props;
    const assets = getAssets(assetsLinks);

    return (
      <html>
        <head>
          <meta charSet="UTF-8" />
          <title>Front</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0, minimal-ui" />
          {
            assets.styles.map(el => <link key={el} rel='stylesheet' href={'/' + el} />)
          }
          {
            routeData ?
              <script
                dangerouslySetInnerHTML={{ __html: `window.__ROUTE_DATA__ = ${routeData}` }}
              >
              </script>
            : ''
          }
          <link rel="icon" type="image/png" href="/images/favicon.png" />
        </head>
        <body>
          <div id="root">
            {children}
          </div>
          {
            assets.scripts.map(el => <script key={el} src={'/' + el}></script>)
          }
        </body>
      </html>
    )
  }
}