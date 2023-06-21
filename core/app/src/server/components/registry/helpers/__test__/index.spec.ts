import { resolveTemplateUrls } from '../';

describe('server:registry:helpers', () => {
  test('resolveTemplate', () => {
    expect(resolveTemplateUrls('https://remotehost/cdn/{name}/widget.tgz', 'cms.navbar@1-dev')).toBe('https://remotehost/cdn/cms.navbar@1-dev/widget.tgz');

    expect(resolveTemplateUrls('https://remotehost/cdn/_test_/widget.tgz', 'cms.navbar@1-dev')).toBe('https://remotehost/cdn/_test_/widget.tgz');

    expect(resolveTemplateUrls('https://remotehost/cdn/_test_/widget.tgz')).toBe('https://remotehost/cdn/_test_/widget.tgz');
  });
});
