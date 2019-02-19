import { Stream, ParseEvents } from "../parse-tools";

/**
 * Find nodes by originalName to locate node updates
 */
export class FindUpdatedNodes extends ParseEvents {
  updates: any;

  constructor(updates: any) {
    super();
    this.updates = updates;
  }

  private filter = (row: any, _: any, cb: any) => {
    const filter = this.updates.find((update: any) =>
      row.originalName.includes(update.file)
    );

    cb(null, filter && row);
  };

  private event = (type: string, data?: any): void => {
    if (type === "data") {
      this.parserEmit("update_nodes_file", data);
      return;
    }

    if (type === "end") {
      this.parserEmit("find_update_nodes_end", data);
      return;
    }
  };

  async run(): Promise<[]> {
    try {
      this.parserEmit("find_update_nodes_begin", null);
      return await new Stream("children.*").run(this.filter, this.event);
    } catch (err) {
      throw err;
    }
  }
}
