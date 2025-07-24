import {constantCase} from "change-case";
import statuses from "statuses";

export const HTTP_STATUS_MESSAGES = statuses.codes.reduce((map: Record<string, {label: string; code: string}>, code: number) => {
  const message: string = String(statuses(code));
  return {
    ...map,
    [String(code)]: {label: message, code: constantCase(message)}
  };
}, {});

HTTP_STATUS_MESSAGES["200"].label = "Success";
HTTP_STATUS_MESSAGES["200"].code = "SUCCESS";

export function getStatusConstant(status: number | string) {
  return (HTTP_STATUS_MESSAGES as any)[status]?.code;
}

export function getStatusMessage(status: number | string) {
  return (HTTP_STATUS_MESSAGES as any)[status]?.label;
}
