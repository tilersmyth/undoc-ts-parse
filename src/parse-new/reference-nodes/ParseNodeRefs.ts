import { FindNodeRefs } from "./FindNodeRefs";
import { ReduceNewNodes } from "../ReduceNewNodes";

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

      const nodes = await new FindNodeRefs(newRefIds).run();
      const reducedNodes = await new ReduceNewNodes("files", nodes).run();

      this.results.push(...reducedNodes.nodes);
      this.refIds.push(...newRefIds);

      const newRefs = reducedNodes.refIds.filter(
        (r: any) => this.refIds.indexOf(r) === -1
      );

      if (newRefs.length > 0) {
        await this.run(newRefs);
      }

      return this.results;
    } catch (err) {
      throw err;
    }
  }
}
