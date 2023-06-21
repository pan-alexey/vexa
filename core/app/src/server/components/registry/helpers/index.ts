export const resolveTemplateUrls = (template: string, name?: string): string => {
  return template.replace(new RegExp('{name}', 'g'), name ? name : '');
};
