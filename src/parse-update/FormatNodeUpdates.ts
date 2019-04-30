import { EntityFields } from "../parse-tools";

export class FormatNodeUpdates {
  diff: any;
  node: any;
  entityFields: EntityFields;

  constructor(diff: any, node: any) {
    this.diff = diff;
    this.node = node;
    this.entityFields = new EntityFields(true);
  }

  private assignKeys = (entity: any, node: any) => {
    const fields = this.entityFields.format()[entity];

    return Object.keys(node).reduce((acc: any, prop: any) => {
      const key = fields[prop];
      const propIsString = typeof node[prop] === "string";

      return key && propIsString ? [...key(node[prop], prop), ...acc] : acc;
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

    return acc;
  };
}
