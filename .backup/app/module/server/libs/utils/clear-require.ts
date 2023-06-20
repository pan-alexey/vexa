export const clearRequire = (requirePath: string) => {
  // @ts-ignore
  Object.keys(__non_webpack_require__.cache).forEach((element) => {
    if (element.includes(requirePath)) {
      // @ts-ignore
      delete __non_webpack_require__.cache[__non_webpack_require__.resolve(element)];
    }
  });
}