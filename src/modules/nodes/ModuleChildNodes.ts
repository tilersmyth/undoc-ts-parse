import { NodeUtils } from "./NodeUtils";

export class ModuleChildNodes {
  node: any;

  constructor(node: any) {
    this.node = node;
  }

  run() {
    try {
      if (!NodeUtils.isPublic(this.node.flags)) {
        return;
      }

      const obj: any = {
        name: this.node.name,
        kind: this.node.kindString,
        description: NodeUtils.description(this.node.comment)
      };

      return obj;
    } catch (err) {
      throw err;
    }
  }
}
