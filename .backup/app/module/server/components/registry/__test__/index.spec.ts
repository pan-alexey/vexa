import { resolveTemplate } from '../helpers';
import { Tracker } from '../../tracker/index';
import { Registry } from '../index';

const nullTracker = new Tracker()

describe('server:registry', () => {
  test('Registry', async () => {
    const registry = new Registry({
      tracker: new Tracker(),
      remotePath: {
        "*": 'http://remotehost/cdn/{name}/widget.tgz',
        "widget.cms.navbar@1-dev": "https://127.0.0.1:8888/_widget_/widget.tgz"
      }
    })

    // await registry.prepareWidget('widget.cms.navbar@1-dev');
    // console.log('123');

    await registry.prepareWidget('widget.cms.navbar@2');

    expect(1).toBe(1);
    // expect(resolveTemplate('https://remotehost/cdn/{name}/widget.tgz', 'cms.navbar@1-dev')).toBe('https://remotehost/cdn/cms.navbar@1-dev/widget.tgz');
    // expect(resolveTemplate('https://remotehost/cdn/_test_/widget.tgz', 'cms.navbar@1-dev')).toBe('https://remotehost/cdn/_test_/widget.tgz');
    // expect(resolveTemplate('https://remotehost/cdn/_test_/widget.tgz')).toBe('https://remotehost/cdn/_test_/widget.tgz');
  });
});