/**
 * @ignore
 */
export function mapAllowedRequiredValues(type: string | string[], schema: any): (string | number | null)[] {
  const allowedRequiredValues = [];

  if (type.includes("string") && !schema.minLength) {
    allowedRequiredValues.push("");
  }

  if (type.includes("null") || (schema.oneOf && schema.oneOf.find((item: any) => item.type === "null"))) {
    allowedRequiredValues.push(null);
  }

  if (type.includes("number") && schema.minimum === 0) {
    allowedRequiredValues.push(0);
  }

  return allowedRequiredValues;
}
