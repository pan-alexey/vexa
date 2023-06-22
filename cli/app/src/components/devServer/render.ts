import { Application } from './';

export const renderHtml = async (app: Application, state: unknown): Promise<string> => {
  return await app.renderBody(state);
};
