import { entityKeys } from "../parse-tools/keys/entityKeys";

export class FormatNodeUpdates {
  diff: any;
  node: any;

  constructor(diff: any, node: any) {
    this.diff = diff;
    this.node = node;
  }

  private assignKeys = (entity: any, node: any) => {
    const fields = entityKeys[entity];

    return Object.keys(node).reduce((acc: any, prop: any) => {
      const key = fields.find((f: any) => f[prop]);
      const propIsString = typeof node[prop] === "string";

      return key && propIsString
        ? [...key[prop](node[prop], prop), ...acc]
        : acc;
    }, []);
  };

  reduce = (acc: any, path: any, index: number, arr: any) => {
    // Parse array by index
    if (Number.isInteger(path)) {
      this.node = this.node[path];
      return acc;
    }

    if (acc.entities.length === 0) {
      acc.entities.push(path);
      this.node = this.node[path];
      return acc;
    }

    const lastEntity: string = acc.entities.slice(-1)[0];

    acc.query.push({
      entity: lastEntity,
      args: this.assignKeys(lastEntity, this.node)
    });

    acc.entities.push(path);

    if (arr.length === index + 1) {
      acc.query.push({
        entity: path,
        args: this.diff.old
      });
    }

    this.node = this.node[path];

    // const args = this.assignKeys(lastEntity, this.node);

    // const lastItem: boolean = arr.length === index + 1;

    // if (lastItem) {
    //   // deleted item
    //   if (this.diff.kind === "D") {
    //     return acc;
    //   }

    //   const lastEntity: string = acc.entities.slice(-1)[0];

    //   acc.query.push({
    //     entity: lastEntity,
    //     args: this.diff.old
    //   });

    //   return acc;
    // }

    // if (Number.isInteger(path)) {
    //   this.node = this.node[path];
    //   return acc;
    // }

    // const lastEntity: string = acc.entities.slice(-1)[0];

    // if (lastEntity) {
    //   const args = this.assignKeys(lastEntity, this.node);

    //   acc.query.push({
    //     entity: lastEntity,
    //     args
    //   });
    // }

    return acc;
  };
}
