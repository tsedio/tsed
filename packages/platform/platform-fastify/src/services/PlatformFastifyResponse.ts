import {PlatformResponse} from "@tsed/platform-http";
import type {FastifyReply} from "fastify";

declare global {
  namespace TsED {
    export interface Response extends FastifyReply {
      locals: Record<string, unknown>;
    }
  }
}

/**
 * @platform
 * @fastify
 */
export class PlatformFastifyResponse extends PlatformResponse<TsED.Response> {}
