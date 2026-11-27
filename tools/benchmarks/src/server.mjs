import {spawn} from "node:child_process";
import {createServer} from "node:net";
import {setTimeout as sleep} from "node:timers/promises";

import {entryOf} from "./targets.mjs";

export const HOST = "127.0.0.1";

export function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, HOST, () => {
      const {port} = server.address();
      server.close(() => resolve(port));
    });
  });
}

/**
 * Command that starts a server, pinned to the server core when `taskset` is available.
 */
export function serverCommand(entry, pinning) {
  const node = [process.execPath, entry];

  return pinning?.server ? ["taskset", ["-c", pinning.server, ...node]] : [node[0], node.slice(1)];
}

/**
 * Starts the server of a target on a platform, with an IPC channel, and waits for it to answer
 * `GET /hello`. Returns the elapsed time from the spawn to the first 200 (the cold start).
 */
export async function startServer(target, platform, {pinning, timeout = 30_000} = {}) {
  const port = await freePort();
  const [command, args] = serverCommand(entryOf(target, platform), pinning);
  const start = process.hrtime.bigint();
  const child = spawn(command, args, {
    env: {...process.env, NODE_ENV: "production", PORT: String(port)},
    stdio: ["ignore", "ignore", "pipe", "ipc"]
  });

  let stderr = "";
  let exited = null;

  child.stderr.on("data", (chunk) => (stderr += chunk));
  child.on("exit", (code) => (exited = code ?? "signal"));

  const baseUrl = `http://${HOST}:${port}`;

  for (;;) {
    if (exited !== null) {
      throw new Error(`${target.name}/${platform} exited with ${exited} before listening:\n${stderr.slice(-2000)}`);
    }

    const response = await fetch(`${baseUrl}/hello`).catch(() => null); // null: not listening yet

    if (response) {
      const body = await response.text();

      if (response.status === 200) {
        break;
      }

      if (response.status >= 500) {
        child.kill("SIGKILL");
        throw new Error(`${target.name}/${platform} answered GET /hello with ${response.status}: ${body.slice(0, 500)}`);
      }
    }

    if (Number(process.hrtime.bigint() - start) / 1e6 > timeout) {
      child.kill("SIGKILL");
      throw new Error(`${target.name}/${platform} did not answer GET /hello within ${timeout} ms:\n${stderr.slice(-2000)}`);
    }

    await sleep(5);
  }

  const startupMs = Number(process.hrtime.bigint() - start) / 1e6;

  return {
    baseUrl,
    startupMs,
    cpuUsage: () => cpuUsage(child),
    stop: () => stopServer(child)
  };
}

function cpuUsage(child) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("The server did not answer the cpu message")), 5_000);

    const onMessage = (message) => {
      if (message?.type === "cpu") {
        clearTimeout(timer);
        child.off("message", onMessage);
        resolve(message.usage);
      }
    };

    child.on("message", onMessage);
    child.send("cpu");
  });
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  const exited = new Promise((resolve) => child.once("exit", resolve));
  child.kill("SIGTERM");

  const timer = setTimeout(() => child.kill("SIGKILL"), 5_000);
  await exited;
  clearTimeout(timer);
}
