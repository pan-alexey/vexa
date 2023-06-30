import { loadScript } from './loadAssets';

type Factory = () => Record<string, unknown>;

interface Container {
  init(shareScope: unknown): void;
  get(module: string): Factory;
}

interface WindowModule {
  __modules__: Record<string, unknown>;
}

export const resolveTemplateUrl = (template: string, name: string): string => {
  return template
    .replace(new RegExp('{moduleName}', 'g'), name ? name : '')
    .replace(new RegExp('{asset}', 'g'), 'module.js');
};

export const loadWidgetModule = async (name: string): Promise<React.ElementType | null> => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await __webpack_init_sharing__('default');
    const windowModules = (window as unknown as { __modules__: Record<string, unknown> }).__modules__ || {};
    if (windowModules[name]) {
      const container = windowModules[name] as Container;
      const factory = await container.get('widget');

      return factory().default as React.ElementType;
    }
  } catch (err) {
    console.log(err);
    // const container = (window as unknown as { widgets: Record<string, unknown> }).widgets[scope] as Container;
  }

  return null;
};

export const loadModule = async (name: string, publicTemplate: string): Promise<React.ElementType | null> => {
  const windowModules = (window as unknown as { __modules__: Record<string, unknown> }).__modules__ || {};

  if (!windowModules[name]) {
    const url = resolveTemplateUrl(publicTemplate, name);
    await loadScript(url);
  }

  return await loadWidgetModule(name);
};
