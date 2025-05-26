export function ancestorOf(target: any): any {
  return target && Object.getPrototypeOf(target);
}

export function getInheritedClass(target: any): any {
  return ancestorOf(target);
}
