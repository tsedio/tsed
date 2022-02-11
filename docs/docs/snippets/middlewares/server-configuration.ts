import {Configuration} from "@tsed/di";

const rootDir = __dirname;

@Configuration({
  rootDir,
  mount: {
    "/rest": `${rootDir}/controllers/**/**.ts`
  },
  componentsScan: [`${rootDir}/services/**/**.ts`, `${rootDir}/middlewares/**/**.ts`]
})
export class Server {}
