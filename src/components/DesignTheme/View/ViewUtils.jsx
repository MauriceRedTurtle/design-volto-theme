import React from 'react';
import { IntlProvider } from 'react-intl';
import { renderToString } from 'react-dom/server';

export const readingTime = (text) => {
  const wordsPerMinute = 250;
  let plain_text = text.replace(/<[^>]*>/g, '');
  let textLength = plain_text.length;
  return textLength > 0 ? Math.ceil(textLength / wordsPerMinute) : 0;
};

export const getHTMLString = (content, locale) =>
  renderToString(<IntlProvider locale={locale}>{content}</IntlProvider>);

export const checkEmptyRichText = (content) => {
  var tag = document.createElement('div');
  tag.innerHTML = content;
  return tag.innerText;
};
