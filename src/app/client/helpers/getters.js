import _get from 'lodash/get';

export async function wrapFetchData(handler, ...args) {
  if (window.__ROUTE_DATA__) {
    let data = {...window.__ROUTE_DATA__};
    delete window.__ROUTE_DATA__;

    return data;
  }

  return handler(...args)
}

export function getDefaultData(props, defaultValue = null) {
  return _get(props, `staticContext.data`)
    || typeof window !== 'undefined' && window.__ROUTE_DATA__ && window.__ROUTE_DATA__.data
    || defaultValue;
}