import { Stream } from "../parse-tools";

import ParserEvents from "../Events";

/**
 * Find nodes by originalName to locate node updates
 */
export class JsonStream {
  files: any;
  stream: Stream;

  constructor(files: any) {
    this.files = files;
    this.stream = new Stream("children.*");
  }

  private newFilter = (row: any, _: any, cb: any) => {
    const filter = this.files.find((update: any) =>
      row.originalName.includes(update.path)
    );

    cb(null, filter && row);
  };

  private oldFilter = (row: any, _: any, cb: any) => {
    const filter = row.originalName.includes(this.files.oldOid);
    cb(null, filter && row);
  };

  private newEvent = (type: string, data?: any): void => {
    if (type === "data") {
      ParserEvents.emitter("parser_update_file_node_found", data);
      return;
    }

    if (type === "end") {
      ParserEvents.emitter("parser_update_find_file_nodes_end", data);
      return;
    }
  };

  async newFile(): Promise<[]> {
    try {
      return await this.stream.many("new", this.newFilter, this.newEvent);
    } catch (err) {
      throw err;
    }
  }

  async oldFile(): Promise<[]> {
    try {
      return await this.stream.one("old", this.oldFilter);
    } catch (err) {
      throw err;
    }
  }
}
