import * as events from "events";

import { Stream } from "../parse-tools/Stream";
import { Output } from "./Output";

/**
 * Find nodes in generated TypeDoc file
 */
export class FindNewNodes extends events.EventEmitter {
  excludeFiles: string[];

  constructor(excludeFiles: string[]) {
    super();
    this.excludeFiles = excludeFiles;
  }

  private filterExcludedFiles(row: any): boolean {
    if (this.excludeFiles.length === 0 || !row.originalName) {
      return true;
    }

    const isExluded = this.excludeFiles.some((filePath: any) =>
      row.originalName.includes(filePath)
    );

    return isExluded ? false : true;
  }

  private filter = (row: any, _: any, cb: any) => {
    if (this.filterExcludedFiles(row)) {
      const filter =
        row.children &&
        row.children.find((child: any) => {
          if (child.comment && child.comment.tags) {
            const hasTag = child.comment.tags.find(
              (t: any) => t.tag === "undoc"
            );
            if (hasTag) {
              child.tagged = true;
              return hasTag;
            }
          }
        });

      cb(null, filter && row);
      return;
    }

    cb(null, null);
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
