import * as Fs from "fs";
import {resolve} from "path";

export function jsMiddleware(path: string) {
  return (req: any, res: any) => {
    const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});
    res.set("Content-Type", "application/javascript");
    res.status(200).send(content);
  };
}
