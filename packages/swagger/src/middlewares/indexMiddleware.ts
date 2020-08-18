import {SwaggerSettings} from "../interfaces/SwaggerSettings";

export function indexMiddleware(viewPath: string, conf: SwaggerSettings & {urls: string[]}) {
  return (req: any, res: any) => {
    const {path = "/", options = {}, showExplorer, cssPath, jsPath, urls} = conf;

    res.render(viewPath, {
      spec: {},
      url: `${path}/swagger.json`,
      urls,
      showExplorer,
      cssPath,
      jsPath,
      swaggerOptions: options
    });
  };
}
