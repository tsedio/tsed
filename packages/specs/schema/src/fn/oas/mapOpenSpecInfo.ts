import {OpenSpecInfo} from "@tsed/openspec";
import {cleanObject} from "@tsed/core";

/**
 * @ignore
 * @param info
 */
export function mapOpenSpecInfo(info: Partial<OpenSpecInfo>): OpenSpecInfo {
  const {title, description, version, termsOfService, contact, license} = info;

  return cleanObject({
    version,
    title,
    description,
    termsOfService,
    contact,
    license
  });
}
