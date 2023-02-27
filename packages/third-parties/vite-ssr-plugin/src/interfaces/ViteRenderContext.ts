import type {IncomingHttpHeaders} from "http";

export type VitePageProps<Data = Record<string, unknown>> = Data & {view: string};

export interface ViteRenderContext<Data = Record<string, unknown>, Session = Record<string, unknown>> extends Record<string, unknown> {
  host: string;
  protocol: string;
  method: string;
  url: string;
  secure: boolean;
  headers: IncomingHttpHeaders;
  session?: Session;
}
