import { EntityFields } from "../parse-tools";

export class ParseNewFiles {
  entityFields: EntityFields;

  constructor() {
    this.entityFields = new EntityFields(false);
  }

  private filterDupeRefIds = (idArr: number[], id: number) => {
    return !idArr.includes(id);
  };

  private fieldKeys = (node: any, acc: any, prop: any) => {
    const key = acc.entity[prop];
    if (key) {
      acc.keys = { ...key(node[prop], prop), ...acc.keys };
    }

    const childEntity = this.entityFields.format()[prop];

    if (childEntity) {
      // Handle array
      if (Array.isArray(node[prop])) {
        const nodeArr = node[prop].reduce(this.reduce, {
          files: [],
          refIds: [],
          parent: prop
        });

        acc.refIds = [...nodeArr.refIds, ...acc.refIds];
        acc.keys[prop] = nodeArr.files;

        return acc;
      }

      // Handle object
      if (typeof node[prop] === "object") {
        const nodeObj = Object.keys(node[prop]).reduce(
          this.fieldKeys.bind(null, node[prop]),
          {
            entity: childEntity,
            keys: {},
            refIds: []
          }
        );

        acc.refIds = [...nodeObj.refIds, ...acc.refIds];
        acc.keys[prop] = nodeObj.keys;
        return acc;
      }

      // Handle type references
      if (node[prop] === "reference" && node.id) {
        acc.refIds = [node.id, ...acc.refIds];
      }
    }

    return acc;
  };

  reduce = (acc: any, file: any) => {
    const entity = this.entityFields.format()[acc.parent];

    const node = Object.keys(file).reduce(this.fieldKeys.bind(null, file), {
      entity,
      keys: {},
      refIds: []
    });

    acc.files = [...acc.files, node.keys];

    // Filter out dupe refIds
    const nodeIds = node.refIds.filter(
      this.filterDupeRefIds.bind(null, acc.refIds)
    );

    acc.refIds = [...nodeIds, ...acc.refIds];

    return acc;
  };
}
