export function concatParameters(parameters: any[], operation: any) {
  return parameters
    .map(param => {
      const f = operation.parameters.find((p: any) => p.in === param.in && p.name === param.name);

      return f || param;
    })
    .concat(...operation.parameters.filter((param: any) => param.in !== "path"));
}
