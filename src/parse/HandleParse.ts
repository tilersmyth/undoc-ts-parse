import { ParseNodes } from "./nodes/ParseNodes";
import { ParseNodeRefs } from "./reference-nodes/ParseNodeRefs";

export class HandleParse {
  async run(): Promise<{ nodes: any; refs: any }> {
    try {
      const results: { nodes: any; refs: any } = {
        nodes: [],
        refs: []
      };

      const { refIds, nodes } = await new ParseNodes().run();
      results.nodes.push(...nodes);

      if (refIds.length > 0) {
        const refs = await new ParseNodeRefs().run(refIds);
        results.refs.push(...refs);
      }

      return results;
    } catch (err) {
      throw err;
    }
  }
}
