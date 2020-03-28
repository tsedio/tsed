export type AliasType = string | number | symbol;
export type AliasMap = Map<AliasType, AliasType>;

export function mapAliasedProperties(value: any, alias: AliasMap) {
  return Object.entries(value).reduce<any>((properties, [key, value]) => {
    key = (alias.get(key) as string) || key;
    properties[key] = value;

    return properties;
  }, {});
}
