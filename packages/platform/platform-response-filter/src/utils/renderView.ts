import {BaseContext} from "@tsed/di";

import {TemplateRenderError} from "../errors/TemplateRenderError.js";

export async function renderView(data: any, $ctx: BaseContext) {
  const {response, endpoint} = $ctx;
  try {
    const {data} = $ctx;
    const {path, options} = endpoint.view;

    return await response.render(path, {...options, ...data, $ctx});
  } catch (err) {
    throw new TemplateRenderError(endpoint.targetName, endpoint.propertyKey, err);
  }
}
