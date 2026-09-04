import {getApiReferenceLinks} from "./utils/sidebar.js";

export const apiLlmLinks = {
  enforce: "pre" as const,
  name: "tsed-api-llm-links",
  transform(content: string, id: string) {
    if (!id.endsWith("/api.md")) {
      return null;
    }

    return content.replace("<!-- API_LLM_LINKS -->", getApiReferenceLinks());
  }
};
