import * as events from "events";

import { JSONStream } from "../stream/JSONStream";
import { Output } from "./Output";

/**
 * Find modules in generated TypeDoc file
 */
export class FindModules extends events.EventEmitter {
  constructor() {
    super();
  }

  private handler = (data: any, cb: any) => {
    const filter =
      data.children && data.children.find((child: any) => child.flags.isPublic);

    if (filter) {
      this.emit("e", "module_found");
      cb(data);
    }
  };

  async run(): Promise<[]> {
    try {
      const output = new Output();
      this.on("e", output.logger);
      this.emit("e", "modules_begin");
      const results = await new JSONStream("children.*").run(this.handler);
      this.removeListener("e", output.logger);
      return results;
    } catch (err) {
      throw err;
    }
  }
}
