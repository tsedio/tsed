const rootDir = __dirname;

export const configuration: any = {
  rootDir,
  httpPort: 3000,
  httpsPort: false,
  logger: {
    level: "off",
    logRequest: true,
    logStart: false,
    jsonIndentation: 0,
    ignoreUrlPatterns: ["/healthcheck", "/v1/hdap//*"],
    requestFields: ["method", "url", process.env.NODE_ENV !== "production" && "body", "query", "params", "duration"].filter(Boolean) as any
  },
  mount: {
    "/": "${rootDir}/controllers/**/*.ts"
  },
  componentsScan: ["${rootDir}/services/**/**.ts", "${rootDir}/middlewares/**/**.ts"]
};
