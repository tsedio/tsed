export function resolveExtension(moduleSpecifier: string) {
  if (moduleSpecifier.match(/\.\/.*/) && !moduleSpecifier.endsWith(".js")) {
    return `${moduleSpecifier}.js`;
  }

  return moduleSpecifier;
}
