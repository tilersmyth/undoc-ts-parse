import { EntityFields } from ".";

export class ParseNodeFields extends EntityFields {
  constructor(parser: "new" | "update") {
    super(parser);
  }

  private handleRefIds = (refIds: number[], node: any) => {
    if (node.type === "reference" && node.id) {
      if (!refIds.includes(node.id)) {
        return [node.id, ...refIds];
      }
    }

    return refIds;
  };

  private reduceArray = (key: string, acc: any, item: any, index: number) => {
    const nodes = Object.entries(item).reduce(this.reduce, {
      entity: key,
      keys: { position: index },
      refIds: acc.refIds
    });

    acc.keys = [...acc.keys, nodes.keys];
    acc.refIds = this.handleRefIds(nodes.refIds, item);

    return acc;
  };

  private reduce = (acc: any, [key, node]: any) => {
    const parentEntity: any = this.format(acc.entity);
    const parentKey = parentEntity[key];

    if (parentKey) {
      acc.keys = { ...parentKey(node, key), ...acc.keys };
    }

    const childEntity = this.format(key);

    if (childEntity) {
      // Handle array
      if (Array.isArray(node)) {
        const nodeArray = node.reduce(this.reduceArray.bind(null, key), {
          keys: [],
          refIds: acc.refIds
        });

        acc.keys[key] = nodeArray.keys;
        acc.refIds = nodeArray.refIds;
        return acc;
      }

      // Handle object
      if (typeof node === "object") {
        const nodeObject = Object.entries(node).reduce(this.reduce, {
          entity: key,
          keys: {},
          refIds: acc.refIds
        });

        acc.keys[key] = nodeObject.keys;
        acc.refIds = this.handleRefIds(nodeObject.refIds, node);
        return acc;
      }
    }

    return acc;
  };

  get = (entity: string, node: any) => {
    const init = {
      entity,
      keys: {},
      refIds: []
    };

    return Object.entries(node).reduce(this.reduce, init);
  };
}
