export async function readSpec(path: string) {
  const {readFile} = await import("node:fs/promises");
  const {existsSync} = await import("node:fs");

  if (existsSync(path)) {
    try {
      const response = await readFile(path, {encoding: "utf8"});

      return JSON.parse(response);
    } catch (e) {}
  }

  /* istanbul ignore next */
  return {};
}
