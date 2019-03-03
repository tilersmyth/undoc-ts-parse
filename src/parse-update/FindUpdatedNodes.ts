import { Stream } from "../parse-tools";

import ParserEvents from "../Events";

/**
 * Find nodes by originalName to locate node updates
 */
export class FindUpdatedNodes {
  updates: any;

  constructor(updates: any) {
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
      ParserEvents.emitter("parser_update_file_node_found", data);
      return;
    }

    if (type === "end") {
      ParserEvents.emitter("parser_update_find_file_nodes_end", data);
      return;
    }
  };

  async run(): Promise<[]> {
    try {
      const fileCount = this.updates.length;
      const context = `Locating updates in ${fileCount} modified file${
        fileCount === 1 ? "" : "s"
      }`;
      ParserEvents.emitter("parser_update_find_file_nodes_start", context);
      return await new Stream("children.*").run(this.filter, this.event);
    } catch (err) {
      throw err;
    }
  }
}
