export class TypeNodes {
  refs: any;

  constructor(refs: any) {
    this.refs = refs;
  }

  private handleRef(nodeId: number) {
    if (nodeId && this.refs.indexOf(nodeId) < 0) {
      this.refs.push(nodeId);
    }
  }

  private handleTypeObj(node: any) {
    if (typeof node === "string") {
      return node;
    }

    if (node.type === "reference") {
      this.handleRef(node.id);
    }

    const obj = {
      type: node.type,
      name: node.name
    };

    return obj;
  }

  private handleTypeArr(nodeArr: any) {
    const resultsArr: any = [];
    for (const node of nodeArr) {
      resultsArr.push(this.handleTypeObj(node));
    }

    return resultsArr;
  }

  private routeType(node: any) {
    if (typeof node === "string") {
      return node;
    }

    if (node instanceof Array) {
      return this.handleTypeArr(node);
    }

    return this.handleTypeObj(node);
  }

  run(target: any, nodes: any): Promise<{}> {
    return new Promise(async (resolve, reject) => {
      try {
        for (const prop in nodes) {
          if (
            [
              "type",
              "types",
              "typeArguments",
              "typeParameter",
              "constraint",
              "elementType"
            ].indexOf(prop) > -1
          ) {
            target[prop] = this.routeType(nodes[prop]);
            this.run(target[prop], nodes[prop]);
            continue;
          }
        }

        resolve(target);
      } catch (err) {
        reject(err);
      }
    });
  }
}
