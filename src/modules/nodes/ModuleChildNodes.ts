import { NodeUtils } from "./NodeUtils";

export class ModuleChildNodes {
  node: any;
  parent: any;
  results: any;

  constructor(node: any, parent: any, results: any) {
    this.node = node;
    this.parent = parent;
    this.results = results;
  }

  run() {
    if (!NodeUtils.isPublic(this.node.flags)) {
      return;
    }

    const obj = {
      module: this.parent,
      name: this.node.name,
      kind: this.node.kindString,
      description: NodeUtils.description(this.node.comment)
    };

    this.results.module_children.push(obj);
  }
}
