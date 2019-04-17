import { nodeKeys } from "../parse-tools/keys/nodeKeys";

export class FormatNodeUpdates {
  diff: any;
  node: any;

  constructor(diff: any, node: any) {
    this.diff = diff;
    this.node = node;
  }

  private entity: string | null = null;

  reduce = (acc: any, path: any, index: number, arr: any) => {
    if (!this.entity) {
      this.node = this.node[path];

      if (!Number.isInteger(path)) {
        this.entity = path;
      }

      return acc;
    }

    const lastItem: boolean = arr.length === index + 1;
    const args = this.node;

    const type =
      args.type && typeof args.type === "string" ? args.type : undefined;

    if (!Number.isInteger(path) && !lastItem) {
      acc.query.push({
        entity: this.entity,
        args: { name: args.name, type, kind: args.kindString }
      });
    }

    if (lastItem) {
      // deleted item
      if (this.diff.kind === "D") {
        return acc;
      }

      const fields = nodeKeys[this.entity];
      const updateObj: any = {};

      for (const prop in this.node) {
        const key = fields.find((f: any) => f[prop]);

        if (key) {
          key[prop](updateObj, this.node[prop], prop);
        }
      }

      acc.update = { [this.entity]: updateObj };

      // Add or update
      acc.query.push({
        entity: this.entity,
        args: { [path]: this.diff.lhs, type, kind: args.kindString }
      });

      return acc;
    }

    this.node = this.node[path];

    if (!Number.isInteger(path)) {
      this.entity = path;
    }

    return acc;
  };
}
