import * as events from "events";

import { Stream } from "../parse-tools/Stream";

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

  private event = (type: string, data?: any): void => {};

  async run(): Promise<[]> {
    try {
      return await new Stream("children.*").run(this.filter, this.event);
    } catch (err) {
      throw err;
    }
  }
}
