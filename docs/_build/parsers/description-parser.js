/**
 *
 * @param content
 * @returns {{content: string, labels: Array}}
 */
function descriptionParser(content = "") {
  let description = content.replace(/^(\/\*\*| \*\/| \* )/gm, "");
  const labels = [];
  let catchLabels = true;

  description = description
    .split("\n")
    .filter(line => {
      if (line.match(/```/)) {
        catchLabels = !catchLabels;
      }

      if (catchLabels && line.match(/^@/gi)) {
        const key = line.split(" ")[0].replace("@", "");
        const value = line.replace("@" + key, "").trim();

        labels.push({key, value: value === "" ? key : value});
        return false;
      }
      return true;
    })
    .map(line => line.replace(/\*\\\//gi, "*/"))
    .join("\n");

  return {content: description.trim() === "/" ? "" : description, labels};
}
/**
 *
 * @param symbol
 * @param symbolType
 */
const regExpTargetDescription = (symbol, symbolType) =>
  new RegExp("\\/\\*\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*\\/\\n" + symbolType + " " + symbol + " ", "");


module.exports = {
  descriptionParser,
  regExpTargetDescription
};
