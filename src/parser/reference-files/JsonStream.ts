import { Stream } from "../tools";
import ParserEvents from "../../Events";

/**
 * Find types referenced in modules
 */
export class NodeRefStream {
  trackedFiles: string[];

  constructor(trackedFiles: string[]) {
    this.trackedFiles = trackedFiles;
  }

  private refIdPaths: any = {};

  private filter = (refIds: number[], row: any, _: any, cb: any) => {
    if (!row.children) {
      return cb(null);
    }

    // Search based on ref id array and must be interface
    const node = row.children.find(
      (child: any) => refIds.includes(child.id) && child.kind === 256
    );

    if (!node) {
      return cb(null);
    }

    const file = row.originalName.substring(row.originalName.indexOf("src"));
    this.refIdPaths[node.id] = { file, node: node.name };

    // Filter out tracked files as these files will get updated elsewhere
    const trackedFile = this.trackedFiles.some((file: string) =>
      row.originalName.includes(file)
    );

    if (row.originalName && trackedFile) {
      return cb(null);
    }

    cb(null, row);
  };

  private event = (type: string, data?: any): void => {
    if (type === "data") {
      ParserEvents.emitter("parser_ref_new_node_found", data);
      return;
    }

    if (type === "end") {
      ParserEvents.emitter("parser_ref_new_node_end", data);
      return;
    }
  };

  async search(refIds: number[]): Promise<{ files: []; refs: {} }> {
    try {
      ParserEvents.emitter("parser_ref_new_node_begin", null);
      const files = await new Stream("children.*").many(
        "new",
        this.filter.bind(null, refIds),
        this.event
      );

      return { files, refs: this.refIdPaths };
    } catch (err) {
      throw err;
    }
  }
}
