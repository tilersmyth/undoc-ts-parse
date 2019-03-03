import { nodeKeys, commentHelper } from "../parse-tools";
import { UpdatedNodeUtils } from "./UpdatedNodeUtils";

import ParserEvents from "../Events";

interface HandleParseUpdateReturn {
  updateResults: any;
  updateRefIds: number[];
  updateFilePaths: string[];
}

export class ReduceUpdatedNodes {
  updates: any;
  nodes: any;
  updateNodeRefs: any = [];
  updateFilePaths: any = [];

  constructor(updates: any, nodes: any) {
    this.updates = updates;
    this.nodes = nodes;
  }

  private findRecursive(node: any, acc: any, update: any) {
    for (const prop in node) {
      if (node[prop] instanceof Array) {
        for (const nodeArr of node[prop]) {
          this.nodeReducer(prop, nodeArr, acc, update);
        }
        continue;
      }

      if (typeof node[prop] === "string") {
        continue;
      }

      this.nodeReducer(prop, node[prop], acc, update);
    }
  }

  private nodeReducer(type: string | null, node: any, acc: any, update: any) {
    // Node init
    if (!type) {
      this.findRecursive(node, acc, update);
      return acc;
    }

    const lineNo = update.lineNo;
    const inRange = UpdatedNodeUtils.inRange(node, lineNo);

    if (inRange) {
      const updateIndex = UpdatedNodeUtils.updateIndex(acc, lineNo);

      acc[updateIndex].query.push({
        table: type,
        args: UpdatedNodeUtils.typeArgs(type, node)
      });

      const isTarget = UpdatedNodeUtils.isTarget(node.position, update);

      if (type === "comment") {
        delete acc[updateIndex].id;
        acc[updateIndex].update = commentHelper({}, node);
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

        // delete acc[updateIndex].id;

        // Need to store refs to look up by id
        if (
          updatedFields.type &&
          updatedFields.type === "reference" &&
          updatedFields.id
        ) {
          this.updateNodeRefs.push(updatedFields.id);
        }

        acc[updateIndex].update = updatedFields;

        return acc;
      }

      this.findRecursive(node, acc, update);
    }

    return acc;
  }

  private mapNodes = (update: any) => {
    const node = this.nodes.find((node: any) =>
      node.originalName.includes(update.file)
    );

    const updates = update.lines
      .reduce(this.nodeReducer.bind(this, null, node), [])
      .filter((line: any) => line.update);

    const context = `${update.file} (${updates.length} node updates)`;
    ParserEvents.emitter("parser_update_file_node_line_updates", context);

    this.updateFilePaths.push(update.file);

    return { file: update.file, updates };
  };

  run(): HandleParseUpdateReturn {
    const updateResults = this.updates.map(this.mapNodes);

    return {
      updateResults,
      updateRefIds: this.updateNodeRefs,
      updateFilePaths: this.updateFilePaths
    };
  }
}
