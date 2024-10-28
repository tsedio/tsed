import {stripsComments} from "@tsed/ts-doc/src/utils/strips.js";

export default {
  name: "codeHighlight",
  trim: false,
  method(overview, symbolName, deprecated) {
    return {code: stripsComments(overview
        .replace(/(    )+#private;\n/gi, ""))
        .replace(/\n(    )+\n/gi, '\n'), deprecated};
  }
};
