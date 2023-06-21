import { Application } from './';

export const renderHtml = async (app: Application, state: unknown): Promise<string> => {
  const widget1 = await app.renderWidget('widget.cms.navbar@1-dev');
  const widget2 = await app.renderWidget('widget.cms.navbar@2-dev');
  const widgetNull = await app.renderWidget('123');
  console.log({ widget1, widget2, widgetNull });
  return widget1;
};
