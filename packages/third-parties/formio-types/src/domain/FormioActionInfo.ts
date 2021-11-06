export interface FormioActionInfo {
  name: string;
  title: string;
  description: string;
  priority: number;
  defaults: {
    handler: string[];
    method: string[];
  };
  access?: {
    handler: boolean;
    method: boolean;
  };
}
