async function readSpec(path: string) {
  const {default: fs} = await import("fs-extra");
  if (fs.existsSync(path)) {
    try {
      return await fs.readJSON(path, {encoding: "utf8"});
    } catch (e) {}
  }

  /* istanbul ignore next */
  return {};
}
