export async function importPackage(packageName: string, loaderFn: Function = () => import(packageName), optional = false) {
  try {
    return await loaderFn();
  } catch (e) {
    if (!optional) {
      throw e;
    }

    return {};
  }
}
