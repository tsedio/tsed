import {UseBefore} from "@tsed/common";
import {useDecorators, StoreSet} from "@tsed/core";
import {AcceptRolesMiddleware} from "./AcceptRolesMiddleware";

export function AcceptRoles(...roles: string[]) {
  return useDecorators(
    UseBefore(AcceptRolesMiddleware),
    StoreSet(AcceptRolesMiddleware, roles)
  );
}
