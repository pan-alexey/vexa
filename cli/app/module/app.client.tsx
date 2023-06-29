import React from 'react';
import { App } from '@vexa/core-app/src/client/App';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import widget from '~widget'; // Подключаем код виджета c использованием alias

(async () => {
  App(widget);
})();
