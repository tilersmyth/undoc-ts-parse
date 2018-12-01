import { SignatureNodes } from "./SignatureNodes";
import { ParameterNodes } from "./ParameterNodes";

export class NestedNodes {
  node: any;
  resultNode: any;
  results: any;

  constructor(node: any, resultNode: any, results: any) {
    this.node = node;
    this.resultNode = resultNode;
    this.results = results;
  }

  async run() {
    for (const prop in this.node) {
      switch (prop) {
        case "signatures":
        case "getSignature":
          this.resultNode[prop] = await new SignatureNodes(
            this.node,
            this.results
          ).run();

          return;
        case "parameters":
          this.resultNode[prop] = await new ParameterNodes(
            this.node,
            this.results
          ).run();
          return;
        default:
          continue;
      }
    }
  }
}
