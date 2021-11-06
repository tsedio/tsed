export interface FormioPermission {
  type: "create_all" | "read_all" | "update_all" | "delete_all" | "create_own" | "read_own" | "update_own" | "delete_own" | "self";
  roles: string[];
}
