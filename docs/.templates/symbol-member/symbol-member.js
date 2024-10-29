export default {
  name: "symbolMember",
  method(member) {
    let deprecated = false;
    const hasParams = member.params.length && member.overview.match(/\((.*)\):/);

    if (member.labels) {
      if (member.labels.find((k) => k.key === "deprecated")) {
        deprecated = true;
      }
    }

    const title = member.overview.match(/(.*)(\(|\?|=|:)+/);

    return {
      title: title ? title[1]
        .split("(")[0]
        .split("<")[0]
        .trim()
        .replace("?", "") : "",
      member,
      deprecated,
      hasParams
    };
  }
};
