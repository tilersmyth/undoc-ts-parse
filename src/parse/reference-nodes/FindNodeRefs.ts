import * as events from "events";

import { Stream } from "../utils/Stream";
import { Output } from "../Output";

/**
 * Find types referenced in modules
 */
export class FindNodeRefs extends events.EventEmitter {
  refs: any;

  constructor(refs: any) {
    super();
    this.refs = refs;
  }

  private filter = (row: any, _: any, cb: any) => {
    // Search based on ref id array and must be interface
    const node = row.children.find(
      (child: any) => this.refs.indexOf(child.id) > -1 && child.kind === 256
    );

    if (!node) {
      return cb(null);
    }

    cb(null, row);
  };

  private event = (type: string, data?: any): void => {
    if (type === "data") {
      this.emit("e", "node_refs_found", data);
      return;
    }

    if (type === "end") {
      this.emit("e", "node_refs_end", data);
      return;
    }
  };

  async run(): Promise<[]> {
    try {
      const output = new Output();
      this.on("e", output.logger);
      this.emit("e", "node_refs_begin");
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
