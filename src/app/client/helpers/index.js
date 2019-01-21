import React from 'react';

import { IS_DEV } from 'constants';

export function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

export function setCookie(name, value, days = 30) {
  let date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * days);
  document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`;
}

export function getLocaleData(data, locale = 'en') {
  if (Array.isArray(data)) {
    return data.map((item) => {
        return item._lang[locale];
    })
  } else if (typeof data === 'object') {
    return data && data._lang[locale];
  } else {
    return '';
  }
}

export function maskNumber(num = 0) {
  num = num.toString();
  let parts = num.split('.');
  parts[0] = parts[0]
    .split('')
    .reverse()
    .join('')
    .match(/\d{1,3}/g)
    .join(',')
    .split('')
    .reverse()
    .join('')

  return parts[0].concat(parts[1] ? `.${parts[1]}` : '')
}

export function afterStartApplication() {

  console.w = (...args) => {
    return IS_DEV ? console.warn(...args.map(arg => arg)) : false;
  }

  console.l = (...args) => {
    return console.log(...args.map(arg => JSON.parse(JSON.stringify(arg))));
  }

}