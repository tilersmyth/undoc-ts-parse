import { NodeUtils } from "./NodeUtils";
import { NestedNodes } from "./NestedNodes";

export class SignatureNodes {
  node: any;
  results: any;

  constructor(nodes: any, results: any) {
    this.node = nodes;
    this.results = results;
  }

  run() {
    const signatures = this.node["signatures"];

    for (const sig of signatures) {
      const obj = {
        parent: this.node.name,
        name: sig.name,
        kind: sig.kindString,
        description: NodeUtils.description(sig.comment)
      };

      this.results.signatures.push(obj);

      new NestedNodes(sig, this.results).run();
    }
  }
}
