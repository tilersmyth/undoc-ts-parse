import * as JSONStream from "JSONStream";
import * as through2 from "through2";

import { FileUtils } from "./FileUtils";

export class Stream {
  path: any;
  constructor(path: any) {
    this.path = path;
  }

  private static createStream() {
    try {
      return FileUtils.readStream(".undoc/docs.json");
    } catch (err) {
      throw err;
    }
  }

  run = async (filter: any, event?: any): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      const results: any = [];
      const stream = Stream.createStream();
      const through = through2.obj(filter);
      stream.pipe(JSONStream.parse(this.path)).pipe(through);
      through.on("data", data => {
        results.push(data);
        if (event) event("data", data);
      });
      through.on("end", () => {
        if (event) event("end");
        resolve(results);
      });
      through.on("error", err => reject(err));
    });
  };
}
