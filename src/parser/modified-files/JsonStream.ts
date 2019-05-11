import { Stream } from "../tools";
import { StreamEvents } from "../Events";

/**
 * Find nodes by originalName to locate node updates
 */
export class ModifiedJsonStream extends StreamEvents {
  stream: Stream;

  constructor() {
    super();
    this.stream = new Stream("children.*");
  }

  private newFilter = (files: any, row: any, _: any, cb: any) => {
    const filter = files.find((update: any) =>
      row.originalName.includes(update.path)
    );

    cb(null, filter && row);
  };

  private oldFilter = (files: any, row: any, _: any, cb: any) => {
    const filter = row.originalName.includes(files.oldOid);
    cb(null, filter && row);
  };

  async newFile(files: any): Promise<[]> {
    try {
      const result = await this.stream.many(
        "new",
        this.newFilter.bind(null, files)
      );

      return result;
    } catch (err) {
      throw err;
    }
  }

  async oldFile(files: any): Promise<[]> {
    try {
      const result = await this.stream.one(
        "old",
        this.oldFilter.bind(null, files)
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}
