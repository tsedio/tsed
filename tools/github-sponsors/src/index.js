const {parseFundingFile} = require("./utils/parse");
const {printDonationMessage} = require("./utils/print");
const {shouldHideMessage} = require("./utils/misc");

async function init(path = process.cwd(), hideMessage = shouldHideMessage()) {
  if (hideMessage) return;
  try {
    const fundingConfig = await parseFundingFile(path);
    printDonationMessage(fundingConfig, path);
  } catch (e) {
    console.error(e);
  }
}

exports.init = init;
