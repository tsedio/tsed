import {OperationMethods} from "@tsed/schema";

export function formatMethod(method: string | undefined) {
  return (method === OperationMethods.CUSTOM ? "use" : method || "use").toLowerCase();
}
