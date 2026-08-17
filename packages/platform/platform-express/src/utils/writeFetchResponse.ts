import {once} from "node:events";

export interface ExpressResponseWriter {
  status(status: number): unknown;
  set(name: string, value: string): unknown;
  write(chunk: Uint8Array): boolean;
  end(callback?: () => void): unknown;
  once(event: "drain", listener: () => void): unknown;
}

/**
 * Writes a portable Fetch response to an Express response.
 */
export async function writeFetchResponse(response: Response, native: ExpressResponseWriter): Promise<void> {
  native.status(response.status);
  response.headers.forEach((value, name) => native.set(name, value));

  if (!response.body) {
    await new Promise<void>((resolve) => native.end(resolve));
    return;
  }

  for await (const chunk of response.body) {
    if (!native.write(chunk)) {
      await once(native as any, "drain");
    }
  }

  await new Promise<void>((resolve) => native.end(resolve));
}
