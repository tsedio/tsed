import {Configuration} from "@tsed/di";

@Configuration({
  mount: {
    "/rest": `./controllers/**/**.ts`
  },
  componentsScan: [`./services/**/**.ts`, `./middlewares/**/**.ts`]
})
export class Server {}
