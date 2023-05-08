/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import widget from '~widget'; // Подключаем код виджета c использованием alias
import { App } from '@vexa/core-app/src/client/app';

(async () => {
  App(widget);
})();
