export function getFormioProps(schema: any) {
  const formioProps: any = Object.entries(schema).reduce((props, [key, value]) => {
    if (key.startsWith("x-formio-")) {
      return {
        ...props,
        [key.replace("x-formio-", "")]: value
      };
    }
    return props;
  }, {});
  return formioProps;
}
