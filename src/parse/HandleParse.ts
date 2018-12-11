import { ParseNodes } from "./nodes/ParseNodes";
import { ParseNodeRefs } from "./reference-nodes/ParseNodeRefs";

export class HandleParse {
  async run(): Promise<[]> {
    try {
      const { refIds, nodes } = await new ParseNodes().run();

      if (refIds.length > 0) {
        await new ParseNodeRefs().run(refIds);
      }

      return nodes;
    } catch (err) {
      throw err;
    }
  }
}
