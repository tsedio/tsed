import {once} from "node:events";

export interface FastifyResponseWriter {
  raw: {
    write(chunk: Uint8Array): boolean;
    end(callback?: () => void): unknown;
    once(event: "drain", listener: () => void): unknown;
  };
  code(statusCode: number): unknown;
  header(name: string, value: string): unknown;
}

/**
 * Writes the finalized Fetch response through Fastify's Node response boundary.
 */
export async function writeFetchResponse(response: Response, reply: FastifyResponseWriter) {
  reply.code(response.status);
  response.headers.forEach((value, name) => reply.header(name, value));

  if (!response.body) {
    await new Promise<void>((resolve) => reply.raw.end(resolve));
    return;
  }

  for await (const chunk of response.body) {
    if (!reply.raw.write(chunk)) {
      await once(reply.raw as any, "drain");
    }
  }

  await new Promise<void>((resolve) => reply.raw.end(resolve));
}
