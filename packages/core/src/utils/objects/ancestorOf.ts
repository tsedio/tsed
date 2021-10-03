export function ancestorOf(target: any): any {
  return Object.getPrototypeOf(target);
}

export function getInheritedClass(target: any): any {
  return ancestorOf(target);
}
