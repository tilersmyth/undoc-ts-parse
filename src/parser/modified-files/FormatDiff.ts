import * as shortid from "shortid";

import { EntityFields, FileUtils } from "../tools";
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
      const updateSize = value.length;

      switch (updateSize) {
        case 1:
          return {
            index: 0,
            type: "added",
            node: isNaN(key) ? { [key]: value[0] } : value[0]
          };
        case 2:
          return {
            index: 1,
            type: "modified",
            node: isNaN(key) ? { [key]: value[1] } : value[1]
          };
        case 3:
          return {
            index: -1,
            type: "deleted",
            node: null
          };
        default:
          throw Error("Unrecognized node update type");
      }
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

              const args = this.assignArgKeys(parent.entity, nodes);

              if (!isNaN(k)) {
                args.push({ key: "position", value: k });
              }

              const targetParent = {
                ...parent,
                id: shortid.generate(),
                args,
                update: {
                  type: update.type,
                  node: null
                }
              };

              // handle nodes added or modified
              if (update.node) {
                const parser = new ParseNodeFields("new");
                const parsedNode = parser.get(parent.entity, update.node);

                // To do: if node empty and it is only update in query then remove
                // query
                if (Object.keys(parsedNode.keys).length === 0) {
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

              // Added nodes should not have their own query object as they
              // dont technically exist yet.. So we make the object easily
              // identifiable so we can add it child on next iteration
              if (update.type === "added") {
                acc.query = [...acc.query, { update: targetParent.update }];
                return acc;
              }

              acc.query = [...acc.query, targetParent];
              return acc;
            }

            const node = nodes[`${k}`];

            if (!isNaN(k)) {
              const args = this.assignArgKeys(parent.entity, node);

              const arrayParent = {
                ...parent,
                id: `${parent.id}${k}`,
                args: [{ key: "position", value: k }, ...args]
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

            // If last update is type "added" then append it to child as update
            // and remove place holder object
            const isAddedUpdate =
              formatter.query[0].update && !formatter.query[0].id
                ? formatter.query[0].update
                : null;

            if (isAddedUpdate) {
              formatter.query.splice(0, 1);
              parent.update = isAddedUpdate;
            }

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
