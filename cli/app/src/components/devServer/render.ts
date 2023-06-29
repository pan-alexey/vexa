import type { Application } from '@vexa/core-app';

export interface RenderProps {
  app: Application;
  state: unknown;
  publicTemplate: string;
  moduleName: string;
  ignoreModuleNames: Array<string>;
}
export const renderHtml = async ({
  app,
  state,
  publicTemplate,
  ignoreModuleNames,
  moduleName,
}: RenderProps): Promise<string> => {
  // application assets // js // css

  // Render head (must be before render body)
  const layoutAssets = await app.renderHead({ state, publicTemplate, ignoreModuleNames });

  const layoutScript: Array<string> = [];
  layoutAssets.js.forEach((js) => {
    layoutScript.push(`<script defer src="${js}"></script>`);
  });

  // render like link
  const layoutStyles: Array<string> = [];
  Object.keys(layoutAssets.css).forEach((key) => {
    layoutStyles.push(`<link href="${key}" rel="stylesheet"></link>`);
  });

  // Render Body
  const body = await app.renderBody(state);

  const html = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <link rel="icon" href="favicon.ico"/>
      <title>${moduleName}</title>
      ${layoutScript.join('')}
      ${layoutStyles.join('')}
  </head>
  <body>
  <div id="app">${body}</div>
  </body>
  </html>
  `;

  return html;
};
