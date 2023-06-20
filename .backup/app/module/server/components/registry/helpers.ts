export const resolveTemplate = (template: string, name?: string): string => {
  return template.replace(new RegExp('{name}', 'g'), name ? name : '');
}