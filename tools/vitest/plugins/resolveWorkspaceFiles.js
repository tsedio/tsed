export function resolveWorkspaceFiles() {
  return {
    name: "resolve-workspace-files",
    resolveId(id) {
      if (id.includes("@tsed")) {
        return id.replace(".js", ".ts");
      }
    }
  };
}
