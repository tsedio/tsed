import {Req, Res} from "@tsed/common";
import * as Fs from "fs";
import {resolve} from "path";

export function cssMiddleware(path: string) {
  return (req: Req, res: Res) => {
    const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});
    res.set("Content-Type", "text/css");
    res.status(200).send(content);
  };
}
