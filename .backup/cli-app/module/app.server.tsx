/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import widget from '~widget'; // Подключаем код виджета c использованием alias
import { Application, Tracker } from '@vexa/core-app/module/server/application';

class DebugTracker extends Tracker {}

export const getApplication = () => {
  const application = new Application({
    resolvePublic: () => '',
    tracker: new DebugTracker(),
  });

  application.registerDevWidget(__name__ as string, widget);

  return application;
};
