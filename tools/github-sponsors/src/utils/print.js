/* eslint-disable no-console */
/* eslint-disable no-control-regex */

const {execSync} = require("child_process");
const chalk = require("chalk");
const path = require("path");

// from nuxt/opencollective

exports.retrieveCols = (() => {
  let result = false;

  return () => {
    if (result) {
      return result;
    }
    const defaultCols = 80;
    try {
      const terminalCols = execSync(`tput cols`, {
        stdio: ["pipe", "pipe", "ignore"]
      });
      result = parseInt(terminalCols.toString()) || defaultCols;
    } catch (e) {
      result = defaultCols;
    }
    return result;
  };
})();

exports.print =
  (color = null) =>
  (str = "") => {
    const terminalCols = exports.retrieveCols();
    const strLength = str.replace(/\u001b\[[0-9]{2}m/g, "").length;
    const leftPaddingLength = Math.floor((terminalCols - strLength) / 2);
    const leftPadding = " ".repeat(Math.max(leftPaddingLength, 0));
    if (color) {
      str = chalk[color](str);
    }

    console.log(leftPadding, str);
  };

exports.printDonationMessage = (fundingConfig, pkgPath) => {
  const packageJson = require(path.resolve(pkgPath) + "/package.json");
  const dim = exports.print("dim");
  const yellow = exports.print("yellow");
  const emptyLine = exports.print();

  yellow(`Thanks for installing ${packageJson.name}`);
  dim("Please consider donating to help us maintain this package.");
  emptyLine();
  emptyLine();
  for (const [platform, value] of Object.entries(fundingConfig)) {
    switch (platform) {
      case "github":
        exports.printGithub(value);
        break;
      case "patreon":
        exports.print()(chalk.bold("Patreon"));
        exports.print()(`${chalk.underline(`https://patreon.com/${value}`)}`);
        break;
      case "open_collective":
        exports.print()(chalk.bold("Open Collective"));
        exports.print()(`${chalk.underline(`https://opencollective.com/${value}`)}`);
        break;
      case "ko_fi":
        exports.print()(chalk.bold("Ko Fi"));
        exports.print()(`${chalk.underline(`https://ko-fi.com/${value}`)}`);
        break;
      case "tidelift":
        exports.print()(chalk.bold("Tidelift"));
        exports.print()(`${chalk.underline(`https://tidelift.com/funding/github/${value}`)}`);
        break;
      case "custom":
        exports.print()(chalk.bold("Sponsorship"));
        exports.print()(`${chalk.underline(value)}`);
        break;
      default:
        break;
    }
  }

  emptyLine();
};

exports.printGithub = (githubUsers) => {
  exports.print()(chalk.bold("GitHub"));
  if (typeof githubUsers === "string") {
    githubUsers = [githubUsers];
  }
  githubUsers.forEach((user) => {
    const link = `https://github.com/users/${user}/sponsorship`;
    exports.print()(`${user}: ${chalk.underline(link)}`);
  });
};
