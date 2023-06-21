import { Application } from './';

export const renderHtml = async (app: Application, state: unknown): Promise<string> => {
  const body = await app.renderWidget('widget.cms.navbar@1-dev');
  return body;
};
