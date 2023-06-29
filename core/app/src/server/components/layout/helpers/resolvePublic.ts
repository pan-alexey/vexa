export const resolvePublic = (template: string, option: { name?: string; asset?: string } = {}): string => {
  const { name = '', asset = '' } = option;

  return template.replace(new RegExp('{moduleName}', 'g'), name).replace(new RegExp('{asset}', 'g'), asset);
};
