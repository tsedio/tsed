try {
  // default ts-node config
  const project = process.env.TS_NODE_PROJECT || process.env._TS_PROJECT_PATH__ || "./tsconfig.json";
  require("ts-node").register({
    project,
    transpileOnly: true
  });
  // opt-in tsconfig-paths config
  require("tsconfig-paths/register");
} catch (error) {
  console.log("[ERROR] " + error.message);
  process.exit(1);
}
