import {shouldHideMessage} from "./utils/misc.js";
import {parseFundingFile} from "./utils/parse.js";
import {printDonationMessage} from "./utils/print.js";

export async function init(path = process.cwd(), hideMessage = shouldHideMessage()) {
  if (hideMessage) return;
  try {
    const fundingConfig = await parseFundingFile(path);
    await printDonationMessage(fundingConfig, path);
  } catch (e) {
    console.error(e);
  }
}
