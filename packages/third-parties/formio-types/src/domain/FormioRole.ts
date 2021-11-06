export interface FormioRole extends Record<string, any> {
  _id: string | undefined;
  title: string;
  description: string;
  deleted: number | null;
  default: boolean;
  admin: boolean;
}
