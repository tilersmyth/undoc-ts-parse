import { FindNodeRefs } from "./FindNodeRefs";
import { ParseNewFiles } from "../ParseNewFiles";

import ParserEvents from "../../Events";

/**
 * Parse found references
 */
export class ParseNodeRefs {
  refIds: number[] = [];
  results: any = [];

  async run(newRefIds: number[]): Promise<[]> {
    try {
      // If newRefs === 0 then all have been searched
      if (newRefIds.length === 0) {
        return [];
      }
      ParserEvents.emitter(
        "parser_ref_find_nodes",
        `Searching for ${newRefIds.length} node reference${
          newRefIds.length > 1 ? "s" : ""
        }`
      );
      const nodes = await new FindNodeRefs(newRefIds).run();

      const parseFiles = new ParseNewFiles();

      const { refIds, files } = nodes.reduce(parseFiles.reduce, {
        files: [],
        refIds: [],
        parent: "files"
      });

      this.results.push(...files);
      this.refIds.push(...newRefIds);
      const newRefs = refIds.filter((r: any) => this.refIds.indexOf(r) === -1);
      if (newRefs.length > 0) {
        await this.run(newRefs);
      }
      return this.results;
    } catch (err) {
      throw err;
    }
  }
}
