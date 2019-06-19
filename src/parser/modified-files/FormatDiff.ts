import * as shortid from "shortid";

import { EntityFields } from "../tools";
import { ParseNodeFields } from "../tools/ParseNodeFields";

export class FormatDiff {
  constructor(private stream: any, private diffs: any, private nodes: any) {
    this.stream = stream;
    this.diffs = diffs;
    this.nodes = nodes;
  }

  private isValidProp = (value: any) => {
    return typeof value === "string" || typeof value === "number";
  };

  private assignArgKeys = (entity: any, node: any) => {
    const entityFields = new EntityFields("args");
    const fields: any = entityFields.format(entity);

    return Object.keys(node).reduce((acc: any, prop: any) => {
      const key = fields[prop];
      const propIsValid = this.isValidProp(node[prop]);

      return key && propIsValid ? [...key(node[prop], prop), ...acc] : acc;
    }, []);
  };

  private updateType = (key: any, value: any) => {
    try {
      const size = value.length;

      if (size === 1) {
        return {
          type: "added",
          node: isNaN(key) ? { [key]: value[0] } : value[0]
        };
      }

      if (size === 2) {
        return {
          type: "modified",
          node: isNaN(key) ? { [key]: value[1] } : value[1]
        };
      }

      if (size === 3) {
        // Position move - modified
        if (value[0] === "") {
          return {
            type: "modified",
            node: { position: value[1] }
          };
        }

        return {
          type: "deleted",
          node: null
        };
      }

      throw Error("Unrecognized node update type");
    } catch (err) {
      throw err;
    }
  };

  private format = (object: any, nodes: any, parent: any): any => {
    return object && typeof object === "object"
      ? Object.entries(object).reduce(
          (acc: any, [k, v]: any) => {
            if (typeof v === "string") {
              return acc;
            }

            // Array in jsondiffpatch means diff
            if (v instanceof Array) {
              const update = this.updateType(k, v);

              const arrMove = k.startsWith("_");
              const key = arrMove ? k.slice(1) : k;
              const node = arrMove ? nodes[`${key}`] : nodes;

              const args = this.assignArgKeys(parent.entity, node);

              const targetParent = {
                ...parent,
                id: shortid.generate(),
                args,
                update: {
                  type: update.type,
                  node: null
                }
              };

              if (!isNaN(key)) {
                targetParent.position = key;
              }

              // If deletion, handle first
              // In the case where a "modify" has been identified as a "delete/add"
              // by diff we need to make sure delete occurs first or incorrect node
              // could get updated
              if (update.type === "deleted") {
                acc.query = [targetParent, ...acc.query];
                return acc;
              }

              // handle nodes added or modified
              if (update.node) {
                const parser = new ParseNodeFields("new");
                const parsedNode = parser.get(parent.entity, update.node);

                // To do: if node empty and it is only update in query then remove
                // query
                if (Object.keys(parsedNode.keys).length === 0) {
                  console.log("to do: update node is empty");
                  return acc;
                }

                if (!isNaN(k)) {
                  parsedNode.keys = { ...parsedNode.keys, position: k };
                }

                targetParent.update.node = {
                  [parsedNode.entity]: parsedNode.keys
                };
              }

              // Event here to ensure false-positive update is not included
              this.stream.modNode("data", 1);

              acc.query = [targetParent, ...acc.query];
              return acc;
            }

            const node = nodes[`${k}`];

            if (!isNaN(k)) {
              const args = this.assignArgKeys(parent.entity, node);

              const arrayParent = {
                ...parent,
                id: `${parent.id}${k}`,
                position: k,
                args
              };

              const formatter = this.format(v, node, arrayParent);

              acc.refIds = [...formatter.refIds];
              acc.query = [...acc.query, ...formatter.query];
              return acc;
            }

            const args = this.assignArgKeys(k, node);

            const objectParent = {
              id: shortid.generate(),
              entity: k,
              args,
              parent: parent.id
            };

            const formatter = this.format(v, node, objectParent);

            acc.refIds = [...formatter.refIds];

            acc.query = parent.parent
              ? [...acc.query, parent, ...formatter.query]
              : [...acc.query, ...formatter.query];

            return acc;
          },
          { query: [], refIds: [] }
        )
      : { query: [], refIds: [] };
  };

  queryBuilder = (filePath: string) => {
    const parent = {
      id: shortid.generate()
    };

    const format = this.format(this.diffs, this.nodes, parent);

    const file = {
      id: parent.id,
      path: filePath,
      query: format.query
    };

    return {
      file,
      refIds: format.refIds
    };
  };
}
