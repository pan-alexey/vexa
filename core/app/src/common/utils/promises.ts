async function promiseAllKeys<T extends Record<string, Promise<unknown>>>(
  values: T,
): Promise<{ [P in keyof T]: Awaited<T[P]> }> {
  type P = keyof T;
  const result: Record<string, T[P]> = {};
  const keys = Object.keys(values);
  const promises: Array<Promise<unknown>> = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    promises.push(values[key]);
  }
  const resolved = await Promise.all(promises);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const res = resolved[i];
    result[key] = res as T[P];
  }

  return result as { [P in keyof T]: Awaited<T[P]> };
}

export { promiseAllKeys };
