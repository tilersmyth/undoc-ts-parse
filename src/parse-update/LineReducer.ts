import { nodeKeys, commentHelper } from "../parse-tools";
import { UpdatedNodeUtils } from "./UpdatedNodeUtils";

import ParserEvents from "../Events";

export class LineReducer {
  private recursive(node: any, cb: any) {
    for (const prop in node) {
      if (node[prop] instanceof Array) {
        for (const nodeArr of node[prop]) {
          cb({ lastNode: node[prop], prop, node: nodeArr });
        }
        continue;
      }

      if (typeof node[prop] === "string") {
        continue;
      }

      cb({ lastNode: null, prop, node: node[prop] });
    }

    cb(null);
  }

  added = (_: any, type: string | null, node: any, acc: any, update: any) => {
    // Node init
    if (!type) {
      this.recursive(node, (item: any) => {
        if (item) {
          this.added(item.lastNode, item.prop, item.node, acc, update);
        }
      });

      return acc;
    }

    const lineNo = update.lineNo;
    const inRange = UpdatedNodeUtils.inRange(node, lineNo);

    if (inRange) {
      const updateIndex = UpdatedNodeUtils.updateIndex(acc.nodes, lineNo);

      acc.nodes[updateIndex].query.push({
        entity: type,
        args: UpdatedNodeUtils.typeArgs(type, node)
      });

      const isTarget = UpdatedNodeUtils.isAddedTarget(node.position, update);

      if (type === "comment") {
        delete acc.nodes[updateIndex].id;
        acc.nodes[updateIndex][type] = commentHelper({}, node);
      }

      if (isTarget) {
        const fields = nodeKeys[type];
        const updatedFields: any = {};
        for (const prop in node) {
          const key = fields.find((f: any) => f[prop]);
          if (key) {
            key[prop](updatedFields, node[prop], prop);
          }
        }

        delete acc.nodes[updateIndex].id;

        // Need to store refs to look up by id
        if (
          updatedFields.type &&
          updatedFields.type === "reference" &&
          updatedFields.id
        ) {
          acc.refs.push(updatedFields.id);
        }

        acc.nodes[updateIndex]["update"] = {};
        acc.nodes[updateIndex]["update"].entity = type;
        acc.nodes[updateIndex]["update"].content = updatedFields;

        return acc;
      }

      this.recursive(node, (item: any) => {
        if (item) {
          this.added(item.lastNode, item.prop, item.node, acc, update);
        }
      });
    }

    return acc;
  };

  modified = (
    lastNode: any | null,
    type: string | null,
    node: any,
    acc: any,
    update: any
  ) => {
    // Node init
    if (!type) {
      this.recursive(node, (item: any) => {
        if (item) {
          this.modified(item.lastNode, item.prop, item.node, acc, update);
        }
      });

      return acc;
    }

    const lineNo = update.lineNo;

    const inRange = UpdatedNodeUtils.inRange(node, lineNo);

    if (inRange) {
      const updateIndex = UpdatedNodeUtils.updateIndex(acc.nodes, lineNo);

      const isTarget = UpdatedNodeUtils.isModifiedTarget(node.position, update);

      if (!isTarget) {
        acc.nodes[updateIndex].query.push({
          entity: type,
          args: UpdatedNodeUtils.typeArgs(type, node)
        });

        if (type === "comment") {
          delete acc.nodes[updateIndex].id;
          acc.nodes[updateIndex][type] = commentHelper({}, node);
        }
      }

      if (isTarget) {
        // Setup update fields
        acc.nodes[updateIndex]["update"] = {};

        const fields = nodeKeys[type];
        const targetFields: any = {};

        // 1. Find target fields
        for (const prop in node) {
          const key = fields.find((f: any) => f[prop]);
          if (key) {
            key[prop](targetFields, node[prop], prop);
          }
        }

        // 2. Determine if updated fields have references
        // that need to be looked at
        if (
          targetFields.type &&
          targetFields.type === "reference" &&
          targetFields.id
        ) {
          acc.refs.push(targetFields.id);
        }

        // Remove target node id for schema validation
        delete acc.nodes[updateIndex].id;

        // 3. If node is not part of an array then set update values
        // and return out
        if (!lastNode) {
          delete targetFields.id;
          acc.nodes[updateIndex]["update"].find = "object";
          acc.nodes[updateIndex]["update"][type] = targetFields;
          return acc;
        }

        // 4. Node is part of an array, so we need to grab parent node
        // and compare to server as we have no way of knowing what is
        // actually updated (we only have the new content)
        const parentNode: any = [];
        for (const n of lastNode) {
          const updatedFieldsObj: any = {};
          for (const prop in n) {
            const key = fields.find((f: any) => f[prop]);
            if (key) {
              key[prop](updatedFieldsObj, n[prop], prop);
            }
          }

          delete updatedFieldsObj.id;
          parentNode.push(updatedFieldsObj);
        }
        acc.nodes[updateIndex]["update"].find = "array";
        acc.nodes[updateIndex]["update"][type] = parentNode;
        return acc;
      }

      this.recursive(node, (item: any) => {
        if (item) {
          this.modified(item.lastNode, item.prop, item.node, acc, update);
        }
      });
    }

    return acc;
  };
}
