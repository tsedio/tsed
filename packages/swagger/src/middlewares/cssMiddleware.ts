import * as Fs from "fs";
import {resolve} from "path";

export function cssMiddleware(path: string) {
  return (req: any, res: any) => {
    const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});
    res.set("Content-Type", "text/css");
    res.status(200).send(content);
  };
}
