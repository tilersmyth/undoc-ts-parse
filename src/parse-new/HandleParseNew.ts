import { ReduceNewNodes } from "./ReduceNewNodes";
import { FindNewNodes } from "./FindNewNodes";
import { ParseNodeRefs } from "./reference-nodes/ParseNodeRefs";
import { ReferenceResolver } from "./resolve-refs/ReferenceResolver";

export class HandleParseNew {
  excludeFiles: string[];
  refIdsFromUpdatedNodes: number[];

  constructor(excludeFiles: string[], refIdsFromUpdatedNodes: number[]) {
    this.excludeFiles = excludeFiles;
    this.refIdsFromUpdatedNodes = refIdsFromUpdatedNodes;
  }

  async run(): Promise<[]> {
    try {
      const results: any = [];

      const newNodes = await new FindNewNodes(this.excludeFiles).run();

      const { refIds, nodes } = await new ReduceNewNodes(
        "files",
        newNodes
      ).run();

      results.push(...nodes);
      refIds.push(...this.refIdsFromUpdatedNodes);

      if (refIds.length > 0) {
        const refs = await new ParseNodeRefs().run(refIds);

        results.push(...refs);

        // Resolve references (place reference path in owner)
        new ReferenceResolver(results).run();
      }

      return results;
    } catch (err) {
      throw err;
    }
  }
}
