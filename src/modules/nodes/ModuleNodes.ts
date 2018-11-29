export class ModuleNodes {
  node: any;
  parent: any;
  results: any;

  constructor(node: any, parent: any, results: any) {
    this.node = node;
    this.parent = parent;
    this.results = results;
  }

  run() {
    const obj = {
      file: this.parent,
      name: this.node.name,
      kind: this.node.kindString
    };

    this.results.modules.push(obj);
  }
}
