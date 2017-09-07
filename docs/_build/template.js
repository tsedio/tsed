"use strict";
const path = require("path");
const highlight = require("./parsers/highlight");
/**
 *
 * @param str
 * @private
 */
const _minify = (str) => str.replace(/\n|\t/gi, "").trim();
/**
 *
 * @param scope
 * @returns {string}
 * @private
 */
const _header = (scope) => {
  const ignoreLabels = ["type", "returns", "decorator", "param"];
  const id = scope.symbolName.replace(/ /gi, "").toLowerCase();
  let isPrivateAdded;
  const labels = (scope.labels || [])
    .filter(label => ignoreLabels.indexOf(label.key) === -1)
    .filter(label => {
      if (label.key === "private" && !isPrivateAdded) {
        isPrivateAdded = true;
        return true;
      }
      if (label.key === "private") {
        return !isPrivateAdded;
      }
      return true;
    })
    .map(item => `<label class="api-type-label ${item.key}">${item.value}</label>`);

  return `
  <header class="symbol-info-header">
    <h1 id="${id}">${scope.symbolName}</h1>
    <label class="symbol-info-type-label ${scope.symbolType}">${scope.symbolLabel}</label>
    ${labels.join("")}
  </header>
`;
};
/**
 *
 * @param scope
 * @returns {string}
 * @private
 */
const _summary = (scope) => {

  const module = scope.modulePath();

  return `
    <section class="symbol-info">
      <table class="is-full-width">
        <tbody>
        <tr>
          <th>Module</th>
          <td>
            <div class="lang-typescript">
                <span class="token keyword">import</span> { ${scope.symbolName} } 
                <span class="token keyword">from</span> 
                <span class="token string">\"${module}\"</span>
                
            </div>
          </td>
        </tr>
        <tr>
          <th>Source</th>
          <td>
            <a href="${scope.url}">
                ${scope.path}
            </a>
        </td>
        </tr>
        
        </tbody>
      </table>
    </section>
    `;
};
/**
 *
 * @param scope
 * @returns {string}
 * @private
 */
const _members = (scope) => {

  let template = [];

  const flattenMembers = scope.getMembers();
  const construct = flattenMembers.filter(member => member.overview.match("constructor"))[0];
  const members = flattenMembers.filter(member => !member.overview.match("constructor"));

  if (construct && (construct.description || !construct.overview.match("constructor()"))) {
    template.push("\n### Constructor\n");
    if (!construct.overview.match("constructor()")) {
      template.push("<pre><code class=\"typescript-lang\">" + highlight(construct.overview) + "</code></pre>");
    }

    if (construct.description) {
      template.push(construct.description);
    }
  }

  if (members.length) {

    template.push("\n### Members\n");


    members.forEach((member, index, map) => {
      //template.push("\n<div class=\"method-overview\">\n");
      let code = highlight(member.overview.trim());

      if (member.labels) {
        if (member.labels.find(k => k.key === "deprecated")) {
          code = "<del>" + code + "</del>";
        }
      }

      template.push("<div class=\"method-overview\"><pre><code class=\"typescript-lang\">" + code + "</code></pre></div>");

      //template.push("\n</div>\n");
      if (member.params.length) {
        template.push(_buildParams(member.params, member.overview));
      }

      if (member.description) {
        template.push(member.description);
      }


      if (index !== map.length - 1) {
        template.push("<hr />");
      }
    });

  }

  return template.join("\n");
};
/**
 *
 * @param labels
 * @param overview
 * @returns {string}
 * @private
 */
const _buildParams = (labels, overview) => {

  const signatureMatch = overview.match(/\((.*)\):/);

  if (signatureMatch) {
    const template = ["\nParam | Type | Description"];
    template.push("---|---|---");

    const signature = signatureMatch[1] + ",";
    labels.forEach((label) => {
      const matched = signature.match(new RegExp(`${label.paramKey}(\\?)?:?(.[^,]+),`));
      const type = label.type || highlight.bindSymbols((matched[2] ? matched[2].trim() : ""), "");
      const description = (matched[1] ? "Optional. " : "")
        + label.description.replace(/Optional\.?/gi, "").trim();

      template.push(`${label.paramKey}| <code>${type.replace(/\|/gi, "&#124;")}</code> |${description}`);
    });

    return template.join("\n") + "\n";
  }
  return "";
};

module.exports = (scope) => {
  const template = [
    _minify(_header(scope)),
    _minify(_summary(scope))
  ];

  if (!!scope.overview) {
    template.push("\n### Overview\n");
    template.push("<pre><code class=\"typescript-lang\">" + highlight(scope.overview, scope.symbolName) + "</code></pre>");
  }

  if (scope.symbolType === "function" || scope.symbolType === "decorator") {
    const params = scope.getParams();
    if (params.length) {
      template.push(_buildParams(params, scope.overview));
    }
  }

  let description = (scope.description || "").trim();

  if (description) {
    template.push("\n### Description\n");
    template.push(description);
  }

  if (scope.members.length) {
    template.push(_members(scope));
  }

  return template.join("\n") + "\n";
};

//https://github.com/angular/angular/tree/4.3.1/packages/animations/src/animation_builder.ts#L53-L62