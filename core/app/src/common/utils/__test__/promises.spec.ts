/** @jest-environment jsdom */
import { promiseAllKeys } from '../promises';

describe('promises', () => {
  test('promiseAllKeys', async () => {
    function fn1<T>(arg: T): Promise<{ result: T }> {
      return new Promise((resolve) => {
        resolve({ result: arg });
      });
    }

    const fn2 = async (arg: number): Promise<number> => {
      await new Promise((r) => setTimeout(r, 1_000));
      return arg;
    };

    const fn3 = async (arg: number): Promise<[{ result: number }, number]> => {
      return Promise.all([fn1(arg), fn2(arg)]);
    };

    const result = await promiseAllKeys({
      test1: fn1('test'),
      test2: fn2(1),
      fn3: fn3(3),
    });

    console.log('result', result);

    expect(1).toBe(1);
  });
});
