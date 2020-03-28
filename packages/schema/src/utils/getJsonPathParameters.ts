function getVariable(subpath: string) {
  const splited = subpath.split(".");
  const name = splited.splice(0, 1)[0];

  return {
    name,
    postfix: splited.length ? `.${splited.join(".")}` : ""
  };
}

export function getJsonPathParameters(base: string, path: string | RegExp | (string | RegExp)[] = ""): {path: string; parameters: any[]}[] {
  if (path instanceof RegExp) {
    path = path
      .toString()
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .replace(/\\/, "");
  }

  const params: any[] = [];
  const paths: any[] = [];
  let isOptional = false;
  let current = "";

  `${base}${path}`
    .replace(/\((.*)\)/gi, "")
    .split("/")
    .filter(o => !!o)
    .map(key => {
      const subpath = key.replace(":", "").replace("?", "");

      if (key.includes(":")) {
        const optional = key.includes("?");

        // Append previous config
        if (optional && !isOptional) {
          isOptional = true;

          paths.push({
            path: current,
            parameters: [].concat(params as any)
          });
        }

        const {name, postfix} = getVariable(subpath);
        current += `/{${name}}${postfix}`;

        params.push({
          in: "path",
          name,
          type: "string",
          required: true
        });

        if (optional && isOptional) {
          paths.push({
            path: current,
            parameters: [].concat(params as any)
          });
        }
      } else {
        current += `/${key}`;
      }
    });

  return paths.length
    ? paths
    : [
        {
          path: current,
          parameters: [].concat(params as any)
        }
      ];
}
