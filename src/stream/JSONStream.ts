import * as jsonStream from "JSONStream";

import { FileUtils } from "../utils/FileUtils";

export class JSONStream {
  path: string = "";
  constructor(path: string) {
    this.path = path;
  }

  private static createStream() {
    try {
      return FileUtils.readStream(".undoc/docs.json");
    } catch (err) {
      throw err;
    }
  }

  parser = async (handler: any): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      const stream = JSONStream.createStream();
      const parser = jsonStream.parse(this.path);
      const results: any = [];
      stream.pipe(parser);
      parser.on("data", data =>
        handler(data, (modules: any) => {
          if (modules.length) results.push(modules);
        })
      );
      parser.on("error", err => reject(err));
      parser.on("end", () => resolve(results));
    });
  };
}
