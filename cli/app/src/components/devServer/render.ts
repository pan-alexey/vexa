import { Application } from './';

export const renderHtml = async (app: Application, state: unknown): Promise<string> => {
  const widget1 = await app.renderWidget('widget.cms.navbar@1');
  const widget2 = await app.renderWidget('widget.cms.navbar@2');
  const widget3 = await app.renderWidget('widget.cms.navbar@3');
  const widgetNull = await app.renderWidget('123');
  // console.log({ widget1, widget2, widget3, widgetNull });

  return [widget1, widget2, widget3].join('<br>');
};
