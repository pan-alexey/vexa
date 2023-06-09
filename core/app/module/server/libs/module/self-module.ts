import path from "path";

export const getSelfModulePath = (): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const resolvePackage = __non_webpack_require__.resolve(__PACKAGE_NAME__ + '/package.json');

  return resolvePackage.slice(0, -'package.json'.length);
}
