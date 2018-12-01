import { NodeUtils } from "./NodeUtils";

export class FileNodes {
  node: any;
  results: any;

  constructor(modules: any, results: any) {
    this.node = modules;
    this.results = results;
  }

  run() {
    try {
      const obj = {
        name: this.node.name,
        path: NodeUtils.filePath(this.node.originalName)
      };

      this.results.files.push(obj);
    } catch (err) {
      throw err;
    }
  }
}
