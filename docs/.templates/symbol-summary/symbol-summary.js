export default {
  name: "symbolSummary",
  trim: false,
  method(symbol) {
    return {
      symbol: {
        ...symbol,
        importFrom: symbol.importFrom.replace("src/types", "src"),
        githubUrl: symbol.githubUrl.replace("src/types", "src"),
        relativePath: symbol.relativePath.replace("src/types", "src")
      }
    };
  }
};
