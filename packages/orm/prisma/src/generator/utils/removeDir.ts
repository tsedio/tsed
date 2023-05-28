import {promises as fs} from "fs";
import path from "path";

export default async function removeDir(dirPath: string, onlyContent: boolean) {
  const dirEntries = await fs.readdir(dirPath, {withFileTypes: true});
  await Promise.all(
    dirEntries.map((dirEntry) => {
      const fullPath = path.join(dirPath, dirEntry.name);
      return dirEntry.isDirectory() ? removeDir(fullPath, false) : fs.unlink(fullPath);
    })
  );
  if (!onlyContent) {
    await fs.rmdir(dirPath);
  }
}
