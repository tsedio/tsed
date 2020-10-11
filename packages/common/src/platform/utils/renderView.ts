import {TemplateRenderError} from "../errors/TemplateRenderError";
import {PlatformContext} from "../domain/PlatformContext";

/**
 * @ignore
 */
export async function renderView(data: any, ctx: PlatformContext) {
  const {response, endpoint} = ctx;
  try {
    const {data} = ctx;
    const {path, options} = endpoint.view;

    return await response.render(path, {...options, ...data});
  } catch (err) {
    throw new TemplateRenderError(endpoint.targetName, endpoint.propertyKey, err);
  }
}
