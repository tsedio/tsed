import {StoreSet, useDecorators} from "@tsed/core";
import {UseBefore} from "@tsed/platform-middlewares";

import {AcceptRolesMiddleware} from "./AcceptRolesMiddleware";

export function AcceptRoles(...roles: string[]) {
  return useDecorators(UseBefore(AcceptRolesMiddleware), StoreSet(AcceptRolesMiddleware, roles));
}
