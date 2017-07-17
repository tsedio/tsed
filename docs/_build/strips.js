/**
 *
 * @param str
 * @private
 */
const stripsTags = (str) => {
  str = str
    .replace(/declare /g, "")
    .replace(/private (.*);\n/g, "\n")
    .replace(/\/\/\/ <reference(.*)\n/g, "")
    .split("/** */");

  return str[str.length - 1];
};
/**
 *
 * @param str
 * @private
 */
const stripsComments = (str) =>
  str.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, "");
/**
 *
 * @param str
 * @private
 */
const stripsMembersComments = (str) =>
  str.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/\n([^class|^interface])/g, "");

module.exports = {
  stripsComments,
  stripsMembersComments,
  stripsTags
};