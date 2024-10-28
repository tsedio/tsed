import {defineLoader} from "vitepress";
import * as fs from "node:fs/promises";
import {mapApiReferences} from "@tsed/vitepress-theme/composables/api/mappers/mapApiReferences";
import type {ApiResponse} from "@tsed/vitepress-theme/composables/api/interfaces/Api";

export interface Data extends ApiResponse {
  // data type
}

declare const data: Data;
export {data};

export default defineLoader({
  watch: ["./public/api.json"],
  async load(watchedFiles) {
    // fetch remote data
    const response = JSON.parse(await fs.readFile(watchedFiles[0], {encoding: "utf-8"}));

    return mapApiReferences(response);
  }
});
