export const clearRequire = (requirePath: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Object.keys(__non_webpack_require__.cache).forEach((element) => {
    if (element.includes(requirePath)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete __non_webpack_require__.cache[__non_webpack_require__.resolve(element)];
    }
  });
};
