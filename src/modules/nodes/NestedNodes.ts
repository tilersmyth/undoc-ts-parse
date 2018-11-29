import { SignatureNodes } from "./SignatureNodes";
import { ParameterNodes } from "./ParameterNodes";

export class NestedNodes {
  node: any;
  results: any;

  constructor(node: any, results: any) {
    this.node = node;
    this.results = results;
  }

  run() {
    for (const prop in this.node) {
      switch (prop) {
        case "signatures":
          return new SignatureNodes(this.node, this.results).run();
        case "parameters":
          return new ParameterNodes(this.node, this.results).run();
        default:
          continue;
      }
    }
  }
}
