// IPC contract between a bench server and the runner, shared by the Ts.ED and the raw apps:
// - the server sends {type: "ready"} once it listens;
// - the runner sends "cpu", the server answers {type: "cpu", usage: process.cpuUsage()}.
// The CPU time is read in the server process, so no extra route is measured.
export function setupIpc() {
  process.on("message", (message) => {
    if (message === "cpu") {
      process.send({type: "cpu", usage: process.cpuUsage()});
    }
  });

  // the server stops with the runner
  process.on("disconnect", () => process.exit(0));
}

export function notifyReady() {
  process.send?.({type: "ready"});
}

export function failed(error) {
  console.error(error);
  process.exit(1);
}
