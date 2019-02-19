import keyFields from "../parse-tools/keys/fields";

export class ReduceNewNodes {
  refIds: number[] = [];
  parent: string = "";
  nodes: any;

  constructor(parent: string, nodes: any) {
    this.parent = parent;
    this.nodes = nodes;
  }

  reducer(type: any, acc: any, node: any) {
    try {
      const fields = keyFields[type];
      const obj: any = {};

      for (const prop in node) {
        const key = fields.find((f: any) => f[prop]);

        if (key) {
          key[prop](obj, node[prop], prop);
        }

        const keys = keyFields[prop];
        if (keys) {
          if (Array.isArray(node[prop])) {
            obj[prop] = node[prop].reduce(this.reducer.bind(this, prop), []);
            continue;
          }

          if (typeof node[prop] === "string") {
            if (
              node[prop] === "reference" &&
              node.id &&
              this.refIds.indexOf(node.id) < 0
            ) {
              this.refIds.push(node.id);
            }
            key[prop](obj, node[prop], prop);
            continue;
          }

          obj[prop] = this.reducer(prop, {}, node[prop]);
        }
      }

      return Array.isArray(acc) ? [...acc, obj] : obj;
    } catch (err) {
      throw err;
    }
  }

  run() {
    return new Promise<{ nodes: any; refIds: number[] }>((resolve, reject) => {
      try {
        const nodes = this.nodes.reduce(
          this.reducer.bind(this, this.parent),
          []
        );

        resolve({ nodes, refIds: this.refIds });
      } catch (err) {
        reject(err);
      }
    });
  }
}
