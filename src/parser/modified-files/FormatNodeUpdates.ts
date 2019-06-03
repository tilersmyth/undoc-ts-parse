import { EntityFields } from "../tools";

export class FormatNodeUpdates {
  diff: any;
  node: any;

  constructor(diff: any, node: any) {
    this.diff = diff;
    this.node = node;
  }

  private isValidProp = (value: any) => {
    return typeof value === "string" || typeof value === "number";
  };

  private assignKeys = (entity: any, node: any) => {
    const entityFields = new EntityFields("args");

    const fields: any = entityFields.format(entity);

    return Object.keys(node).reduce((acc: any, prop: any) => {
      const key = fields[prop];
      const propIsValid = this.isValidProp(node[prop]);

      return key && propIsValid ? [...key(node[prop], prop), ...acc] : acc;
    }, []);
  };

  private targetNodeKeys = (entity: any, node: any) => {
    const entityFields = new EntityFields("update");

    const fields: any = entityFields.format(entity);

    return Object.keys(node).reduce((acc: any, prop: any) => {
      const key = fields[prop];
      const propIsValid = this.isValidProp(node[prop]);

      return key && propIsValid ? { ...key(node[prop], prop), ...acc } : acc;
    }, {});
  };

  reduce = (acc: any, path: any, index: number, arr: any) => {
    const lastPath = arr.length === index + 1;

    // Parse array by index
    if (Number.isInteger(path) && !lastPath) {
      this.node = this.node[path];
      return acc;
    }

    if (acc.entities.length === 0) {
      acc.entities.push(path);
      this.node = this.node[path];
      return acc;
    }

    const lastEntity: string = acc.entities.slice(-1)[0];

    if (!Number.isInteger(path)) {
      acc.query.push({
        entity: lastEntity,
        args: this.assignKeys(lastEntity, this.node)
      });
    }

    acc.entities.push(path);

    if (lastPath) {
      const targetEntity: string = Number.isInteger(path) ? lastEntity : path;

      // if (this.diff.kind === "A") {
      // console.log(this.diff);
      // }

      acc.query.push({
        entity: targetEntity,
        args: this.diff.old
      });

      acc.newNode = this.targetNodeKeys(targetEntity, this.node[path]);
    }

    this.node = this.node[path];
    return acc;
  };
}
