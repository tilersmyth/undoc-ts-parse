import { Stream } from "../parse-tools";
import ParserEvents from "../Events";

/**
 * Find nodes in generated TypeDoc file
 */
export class FindNewNodes {
  excludeFiles: string[];

  constructor(excludeFiles: string[]) {
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
      ParserEvents.emitter("parser_new_node_found", data);
      return;
    }

    if (type === "end") {
      ParserEvents.emitter("parser_new_find_nodes_end", data);
      return;
    }
  };

  async run(): Promise<[]> {
    try {
      ParserEvents.emitter("parser_new_find_nodes_begin", null);
      return await new Stream("children.*").run(this.filter, this.event);
    } catch (err) {
      throw err;
    }
  }
}
