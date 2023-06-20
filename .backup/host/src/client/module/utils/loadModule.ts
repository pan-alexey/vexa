import { loadScript } from './loadAssets';

type Factory = () => Record<string, unknown>;

interface Container {
  init(shareScope: unknown): void;
  get(module: string): Factory;
}

export const loadModule = async (url: string, scope: string, module = 'widget'): Promise<React.ElementType> => {
  try {
    await __webpack_init_sharing__('default');

    await loadScript(url);
    const container = (window as unknown as { widgets: Record<string, unknown> }).widgets[scope] as Container;

    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);
    return factory().default as React.ElementType;
  } catch (error) {
    console.error('Error loading module:', error);
    throw error;
  }
};
