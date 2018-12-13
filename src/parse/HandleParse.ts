import { ParseNodes } from "./nodes/ParseNodes";
import { ParseNodeRefs } from "./reference-nodes/ParseNodeRefs";
import { ReferenceResolver } from "./resolve-refs/ReferenceResolver";

export class HandleParse {
  async run(): Promise<[]> {
    try {
      const results: any = [];

      const { refIds, nodes } = await new ParseNodes().run();
      results.push(...nodes);

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
