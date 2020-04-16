import {UseBefore} from "@tsed/common/src";
import {applyDecorators, StoreSet} from "@tsed/core";
import {AcceptRolesMiddleware} from "./AcceptRolesMiddleware";

export function AcceptRoles(...roles: string[]) {
  return applyDecorators(
    UseBefore(AcceptRolesMiddleware),
    StoreSet(AcceptRolesMiddleware, roles)
  );
}
