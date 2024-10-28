export default {
  name: "symbolHeader",
  trim: true,
  method(symbol) {
    const ignoreLabels = ["type", "returns", "decorator", "param", "constructor"];
    const id = symbol.symbolName.replace(/ /gi, "").toLowerCase();
    let isPrivateAdded;

    const labels = (symbol.labels || [])
      .filter((label) => ignoreLabels.indexOf(label.key) === -1)
      .filter((label) => {
        if (label.key === "private" && !isPrivateAdded) {
          isPrivateAdded = true;
          return true;
        }
        if (label.key === "private") {
          return !isPrivateAdded;
        }
        return true;
      });

    return {
      id,
      symbol,
      labels
    };
  }
};
