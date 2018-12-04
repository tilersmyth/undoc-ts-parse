import { SignatureNodes } from "./SignatureNodes";
import { ParameterNodes } from "./ParameterNodes";

export class NestedNodes {
  node: any;
  resultNode: any;
  refs: any;

  constructor(node: any, resultNode: any, refs: any) {
    this.node = node;
    this.resultNode = resultNode;
    this.refs = refs;
  }

  async run() {
    for (const prop in this.node) {
      switch (prop) {
        case "signatures":
        case "getSignature":
          this.resultNode[prop] = await new SignatureNodes(
            this.node,
            this.refs
          ).run();

          return;
        case "parameters":
          this.resultNode[prop] = await new ParameterNodes(
            this.node,
            this.refs
          ).run();
          return;
        default:
          continue;
      }
    }
  }
}
