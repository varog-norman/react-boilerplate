import { addLocaleData } from 'react-intl';

export const enabledLanguages = ['en', 'ru'];
export const localizationData = {};

function flattenMessages(nestedMessages = {}, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

enabledLanguages.forEach((language) => {
  let locData = require(`./localizationData/${language}`).default;
  let loc = require(`react-intl/locale-data/${language}`);
  addLocaleData(loc);
  localizationData[language] = locData;
  localizationData[language].messages = flattenMessages(localizationData[language].messages);
});

