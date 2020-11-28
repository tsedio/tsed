export function getInheritedClass(target: any): any {
  return Object.getPrototypeOf(target);
}
