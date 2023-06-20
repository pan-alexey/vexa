import { resolveTemplate } from '../helpers';

describe('server:registry:helpers', () => {
  test('resolveTemplate', () => {

    expect(resolveTemplate('https://remotehost/cdn/{name}/widget.tgz', 'cms.navbar@1-dev')).toBe('https://remotehost/cdn/cms.navbar@1-dev/widget.tgz');

    expect(resolveTemplate('https://remotehost/cdn/_test_/widget.tgz', 'cms.navbar@1-dev')).toBe('https://remotehost/cdn/_test_/widget.tgz');

    expect(resolveTemplate('https://remotehost/cdn/_test_/widget.tgz')).toBe('https://remotehost/cdn/_test_/widget.tgz');
  });
});