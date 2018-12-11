import * as events from "events";

import { Stream } from "../utils/Stream";
import { Output } from "../Output";

/**
 * Find modules in generated TypeDoc file
 */
export class FindModules extends events.EventEmitter {
  constructor() {
    super();
  }

  private filter = (row: any, _: any, cb: any) => {
    const filter =
      row.children &&
      row.children.find((child: any) => {
        if (child.comment && child.comment.tags) {
          return child.comment.tags.find((t: any) => t.tag === "undoc");
        }
      });

    cb(null, filter && row);
  };

  private event = (type: string, data?: any): void => {
    if (type === "data") {
      this.emit("e", "nodes_found", data);
      return;
    }

    if (type === "end") {
      this.emit("e", "nodes_end", data);
      return;
    }
  };

  async run(): Promise<[]> {
    try {
      const output = new Output();
      this.on("e", output.logger);
      this.emit("e", "nodes_begin", null);
      const results = await new Stream("children.*").run(
        this.filter,
        this.event
      );
      this.removeListener("e", output.logger);
      return results;
    } catch (err) {
      throw err;
    }
  }
}
