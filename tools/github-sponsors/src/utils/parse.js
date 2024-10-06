import fs from "fs";
import {promisify} from "util";
import YAML from "yaml";

const readFile = promisify(fs.readFile);
const access = promisify(fs.access);

const FUNDING_FILENAME = "FUNDING.yml";

// Parse the FUNDING.yml and return the content
export async function parseFundingFile(path = process.cwd()) {
  const pathToFile = `${path}/.github/${FUNDING_FILENAME}`;
  try {
    await access(pathToFile, fs.constants.R_OK);
  } catch (e) {
    throw new Error("FUNDING.yml file not found");
  }

  const fileContent = await readFile(pathToFile, "utf-8");
  return YAML.parse(fileContent);
}
