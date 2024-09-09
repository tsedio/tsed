import {OperationVerbs} from "@tsed/schema";

export function formatMethod(method: string | undefined) {
  return (method === OperationVerbs.CUSTOM ? "use" : method || "use").toLowerCase();
}
