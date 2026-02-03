import type {FastifyHttpOptions, FastifyInstance} from "fastify";

export interface PlatformFastifySettings extends FastifyHttpOptions<any, any> {
  app?: FastifyInstance;
}
