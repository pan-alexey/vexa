import { parseWidgetName } from '../widget';

describe('common:widget', () => {
  test('parseWidgetName', async () => {
    expect(parseWidgetName('cms.navbar@1-dev')).toBe(null);
    expect(parseWidgetName('context.navbar@1-dev')).toBe(null);
    expect(parseWidgetName('context.cms.@1-dev')).toBe(null);
    expect(parseWidgetName('context.cms.navbar')).toBe(null);
    expect(parseWidgetName('context.cms.navbar@')).toBe(null);

    expect(parseWidgetName('widget.cms.navbar@1-dev')).toEqual({
      type: 'widget',
      owner: 'cms',
      name: 'navbar',
      version: '1-dev',
    });


    expect(parseWidgetName('context.cms.navbar@1-dev')).toEqual({
      type: 'context',
      owner: 'cms',
      name: 'navbar',
      version: '1-dev',
    });

    expect(parseWidgetName('context.cms.navbar@1-dev')).toEqual({
      type: 'context',
      owner: 'cms',
      name: 'navbar',
      version: '1-dev',
    });

    expect(parseWidgetName('context.cms.navbar@dev')).toEqual({
      type: 'context',
      owner: 'cms',
      name: 'navbar',
      version: 'dev',
    });

    expect(parseWidgetName('context.cms.navbar@alpha')).toEqual({
      type: 'context',
      owner: 'cms',
      name: 'navbar',
      version: 'alpha',
    });
  });
});


'widget.cms.navbar@1~dev'