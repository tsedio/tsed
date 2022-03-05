export const attributeRegex = /(@TsED\.)+([A-z])+(\()(.*)(\))+/;
export const attributeNameRegex = /(?:\.)+([A-Za-z])+(?:\()+/;
export const attributeArgsRegex = /(?:\()+([A-Za-z])+\:+(.+)+(?:\))+/;
export const argsRegex = /(?:\()+((.+))+(?:\))+/;

export function parseDocumentationAttributes(documentation: string | undefined): {name: string; content: string; arguments: string[]}[] {
  if (!documentation) {
    return [];
  }

  return documentation
    .split("\n")
    .map((current) => {
      const attribute = current.match(attributeRegex)?.[0];

      if (!attribute) {
        return;
      }

      const attributeName = current.match(attributeNameRegex)?.[0]?.slice(1, -1);
      const rawAttributeArgs = attribute.match(attributeArgsRegex)?.[0]?.slice(1, -1);
      const args: any[] = [];

      if (rawAttributeArgs) {
        const splitRawArgsArray = rawAttributeArgs.split(",").map((it) => it.trim());
        const parsedAttributeArgs =
          splitRawArgsArray &&
          (Object.fromEntries(
            splitRawArgsArray.map((it) => {
              const [key, value] = it.split(": ");
              return [key, JSON.parse(value)];
            })
          ) as Partial<object>);

        args.push(parsedAttributeArgs);
      } else {
        const inputs = attribute
          .match(argsRegex)?.[0]
          ?.slice(1, -1)
          ?.split(",")
          .map((it) => it.trim());

        args.push(...(inputs || []));
      }

      return {
        name: attributeName,
        content: attribute,
        arguments: args
      };
    })
    .map((options) => {
      if (options?.name === "Ignore") {
        const args = options.arguments.join(" && ");

        return {
          ...options,
          arguments: [`(value: any, ctx: any) => ${args}`]
        };
      }
      return options;
    })
    .filter(Boolean) as any[];
}
