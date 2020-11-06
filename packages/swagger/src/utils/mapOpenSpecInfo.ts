import {cleanObject} from "@tsed/core";
import {OpenSpecInfo} from "@tsed/openspec";

/**
 * @ignore
 * @param info
 * @param defaultVersion
 */
export function mapOpenSpecInfo(info: Partial<OpenSpecInfo>, defaultVersion: string): OpenSpecInfo {
  const {title, description, version: versionInfo, termsOfService, contact, license} = info;

  return cleanObject({
    version: versionInfo || defaultVersion,
    title,
    description,
    termsOfService,
    contact,
    license
  });
}
