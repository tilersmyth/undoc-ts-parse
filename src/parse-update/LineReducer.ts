import { nodeKeys, commentHelper } from "../parse-tools";
import { UpdatedNodeUtils } from "./UpdatedNodeUtils";

import ParserEvents from "../Events";

export class LineReducer {
  private recursive(node: any, cb: any) {
    for (const prop in node) {
      if (node[prop] instanceof Array) {
        for (const nodeArr of node[prop]) {
          cb({ prop, node: nodeArr });
        }
        continue;
      }

      if (typeof node[prop] === "string") {
        continue;
      }

      cb({ prop, node: node[prop] });
    }

    cb(null);
  }

  added = (type: string | null, node: any, acc: any, update: any) => {
    // Node init
    if (!type) {
      this.recursive(node, (item: any) => {
        if (item) {
          this.added(item.prop, item.node, acc, update);
        }
      });

      return acc;
    }

    const lineNo = update.lineNo;
    const inRange = UpdatedNodeUtils.inRange(node, lineNo);

    if (inRange) {
      const updateIndex = UpdatedNodeUtils.updateIndex(acc.nodes, lineNo);

      acc.nodes[updateIndex].type = type;

      acc.nodes[updateIndex].query.push({
        table: type,
        args: UpdatedNodeUtils.typeArgs(type, node)
      });

      const isTarget = UpdatedNodeUtils.isAddedTarget(node.position, update);

      if (type === "comment") {
        delete acc.nodes[updateIndex].id;
        acc.nodes[updateIndex].update = commentHelper({}, node);
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

        acc.nodes[updateIndex].update = updatedFields;

        return acc;
      }

      this.recursive(node, (item: any) => {
        if (item) {
          this.added(item.prop, item.node, acc, update);
        }
      });
    }

    return acc;
  };

  modified = (type: string | null, node: any, acc: any, update: any) => {
    // Node init
    if (!type) {
      this.recursive(node, (item: any) => {
        if (item) {
          this.modified(item.prop, item.node, acc, update);
        }
      });

      return acc;
    }

    const lineNo = update.lineNo;
    const inRange = UpdatedNodeUtils.inRange(node, lineNo);

    if (inRange) {
      const updateIndex = UpdatedNodeUtils.updateIndex(acc.nodes, lineNo);

      acc.nodes[updateIndex].type = type;

      acc.nodes[updateIndex].query.push({
        table: type,
        args: UpdatedNodeUtils.typeArgs(type, node)
      });

      const isTarget = UpdatedNodeUtils.isModifiedTarget(node.position, update);

      if (type === "comment") {
        delete acc.nodes[updateIndex].id;
        acc.nodes[updateIndex].update = commentHelper({}, node);
      }

      if (isTarget) {
        const fields = nodeKeys[type];
        const updatedFields: any = {};
        for (const prop in node) {
          const key = fields.find((f: any) => f[prop]);
          if (key) {
            key[prop](updatedFields, node, prop);
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

        acc.nodes[updateIndex].update = updatedFields;

        return acc;
      }

      this.recursive(node, (item: any) => {
        if (item) {
          this.modified(item.prop, item.node, acc, update);
        }
      });
    }

    return acc;
  };
}
