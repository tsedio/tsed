const execa = require("execa");
const fs = require("fs");
const {doc} = require("../../repo.config");
const {branch} = require("../../release.config");

module.exports = {
  async publish() {
    if (doc.publish) {
      const currentBranch = process.env.TRAVIS_BRANCH;

      if (currentBranch !== branch) {
        console.log(
          `This test run was triggered on the branch ${currentBranch}, while docs is configured to only publish from ${
            branch
          }, therefore a new docs version won’t be published.`
        );
        return;
      }

      const pkg = JSON.parse(fs.readFileSync("./package.json", {encoding: "utf8"}));
      const {version} = pkg;
      const {url, cname, branch: branchDoc} = doc;

      const {GH_TOKEN} = process.env;
      const repository = url.replace("https://", "");

      const vuePressPath = "./docs/.vuepress/dist";

      fs.writeFileSync(`${vuePressPath}/CNAME`, cname, {});

      try {
        await execa("git", ["init"], {
          cwd: vuePressPath,
          stdio: ["inherit"]
        });

        await execa("git", ["add", "-A"], {
          cwd: vuePressPath,
          stdio: ["inherit"]
        });

        try {
          await execa("git", ["commit", "-m", `'Deploy documentation v${version}'`], {
            cwd: vuePressPath,
            stdio: ["inherit"]
          });
        } catch (er) {
        }

        await execa("git", ["push", "--set-upstream", "-f", `https://${GH_TOKEN}@${repository}`, `master:${branchDoc}`], {
          cwd: vuePressPath,
          stdio: ["inherit"]
        });
      } catch (er) {
        console.error(er);
      }
    }
  }
};
