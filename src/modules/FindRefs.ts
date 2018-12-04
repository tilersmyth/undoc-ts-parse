import * as events from "events";

import { JSONStream } from "../stream/JSONStream";
import { Output } from "./Output";

/**
 * Find types referenced in modules
 */
export class FindRefs extends events.EventEmitter {
  refs: any;

  constructor(refs: any) {
    super();
    this.refs = refs;
  }

  private handler = (data: any, cb: any) => {
    const filter =
      data.children &&
      data.children.find(
        (child: any) =>
          this.refs.indexOf(child.id) > -1 && child.flags.isExported
      );

    if (filter) {
      this.emit("e", "ref_found");
      cb(data);
    }
  };

  async run(): Promise<[]> {
    try {
      const output = new Output();
      this.on("e", output.logger);
      this.emit("e", "refs_begin");
      const results = await new JSONStream("children.*").run(this.handler);
      this.removeListener("e", output.logger);
      return results;
    } catch (err) {
      throw err;
    }
  }
}
