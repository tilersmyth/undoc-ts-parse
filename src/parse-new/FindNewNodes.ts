import { Stream } from "../parse-tools";
import ParserEvents from "../Events";

/**
 * Find nodes in generated TypeDoc file
 */
export class FindNewNodes {
  newFiles: string[];

  constructor(newFiles: string[]) {
    this.newFiles = newFiles;
  }

  private isNewFile(row: any): boolean {
    if (!row.originalName) {
      return true;
    }

    return this.newFiles.some((filePath: any) =>
      row.originalName.includes(filePath)
    );
  }

  private filter = (row: any, _: any, cb: any) => {
    if (!this.isNewFile(row)) {
      cb(null, null);
      return;
    }

    const filter =
      row.children &&
      row.children.find((child: any) => {
        if (child.comment && child.comment.tags) {
          const hasTag = child.comment.tags.find((t: any) => t.tag === "undoc");
          if (hasTag) {
            child.tagged = true;
            return hasTag;
          }
        }
      });

    cb(null, filter && row);
    return;
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
      return await new Stream("children.*").many(
        "new",
        this.filter,
        this.event
      );
    } catch (err) {
      throw err;
    }
  }
}
