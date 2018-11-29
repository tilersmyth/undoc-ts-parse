import { NodeUtils } from "./NodeUtils";
import { NestedNodes } from "./NestedNodes";

export class ParameterNodes {
  node: any;
  results: any;

  constructor(nodes: any, results: any) {
    this.node = nodes;
    this.results = results;
  }

  run() {
    const parameters = this.node["parameters"];

    for (const param of parameters) {
      const obj = {
        parent: this.node.name,
        parentKind: this.node.kindString,
        name: param.name
      };

      this.results.parameters.push(obj);

      new NestedNodes(param, this.results).run();
    }
  }
}
