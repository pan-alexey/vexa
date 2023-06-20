export const cssModulesRules = (isDev: boolean, isModules = false) => {
  const modules = isModules
    ? {
        mode: 'local',
        localIdentName: isDev ? '[path][name]__[local]--[hash:base64:5]' : '[local]-[hash:base64:5]',
      }
    : {
        mode: 'global',
      };

  return {
    loader: 'css-loader',
    options: {
      import: true,
      importLoaders: true,
      modules,
    },
  };
};
