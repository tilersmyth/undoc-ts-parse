export class ModuleNodes {
  node: any;
  parent: any;

  constructor(node: any, parent: any) {
    this.node = node;
    this.parent = parent;
  }

  run() {
    try {
      const obj: any = {
        file: this.parent,
        name: this.node.name,
        kind: this.node.kindString,
        moduleChildren: []
      };

      return obj;
    } catch (err) {
      throw err;
    }
  }
}
