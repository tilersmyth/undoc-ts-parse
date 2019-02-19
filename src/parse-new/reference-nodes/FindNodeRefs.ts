import { Stream, ParseEvents } from "../../parse-tools";

/**
 * Find types referenced in modules
 */
export class FindNodeRefs extends ParseEvents {
  refs: any;

  constructor(refs: any) {
    super();
    this.refs = refs;
  }

  private filter = (row: any, _: any, cb: any) => {
    if (!row.children) {
      return cb(null);
    }

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
      this.parserEmit("node_refs_found", data);
      return;
    }

    if (type === "end") {
      this.parserEmit("node_refs_end", data);
      return;
    }
  };

  async run(): Promise<[]> {
    try {
      this.parserEmit("node_refs_begin", null);
      return await new Stream("children.*").run(this.filter, this.event);
    } catch (err) {
      throw err;
    }
  }
}
