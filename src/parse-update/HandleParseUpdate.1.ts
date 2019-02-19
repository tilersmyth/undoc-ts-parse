import { Stream } from "../parse-tools/Stream";
import keyFields from "../parse-tools/keys/fields";
import { comment } from "../parse-tools/keys/helpers";

interface HandleParseUpdateReturn {
  updateResults: any;
  updateRefIds: number[];
  updateFilePaths: string[];
}

export class HandleParseUpdate {
  updates: any;
  results: any;
  refIds: number[] = [];
  updateFilePaths: string[] = [];

  constructor(updates: any) {
    this.updates = updates;
  }

  private filter = (row: any, _: any, cb: any) => {
    const filter = this.updates.find((update: any) =>
      row.originalName.includes(update.file)
    );

    cb(null, filter && row);
  };

  private event = (type: string, data?: any): void => {};

  private static inRange(node: any, lineNo: number): boolean {
    const position = node.position;
    if (!position) {
      return false;
    }

    return lineNo >= position.nodeStart && lineNo <= position.nodeEnd;
  }

  private static isTarget(position: any, update: any) {
    if (position.lineStart !== position.lineEnd) {
      return false;
    }

    if (update.lineNo === position.lineStart) {
      // Check if line changes are inconsequential by
      // comparing node position to unchanged cols
      const unchangedCols = update.cols.some(
        (col: any) =>
          col.start <= position.colStart && col.end >= position.colEnd
      );

      if (!unchangedCols) {
        return true;
      }
    }

    return false;
  }

  private recursive(node: any, acc: any, update: any) {
    for (const prop in node) {
      if (node[prop] instanceof Array) {
        for (const nodeArr of node[prop]) {
          this.reducer(prop, nodeArr, acc, update);
        }
        continue;
      }

      if (typeof node[prop] === "string") {
        continue;
      }

      this.reducer(prop, node[prop], acc, update);
    }
  }

  private updateIndex(acc: any, lineNo: number): number {
    const lineIndex = acc.findIndex((line: any) => line.id === lineNo);

    if (lineIndex < 0) {
      const newLine = acc.push({ id: lineNo, query: [] });
      return newLine - 1;
    }

    return lineIndex;
  }

  private typeArgs(type: string, node: any) {
    // To do: abstract for all node types

    if (type === "type") {
      return {
        name: node.name,
        type: node.type
      };
    }

    return { name: node.name };
  }

  private reducer(type: string | null, node: any, acc: any, update: any) {
    // Node init
    if (!type) {
      this.recursive(node, acc, update);
      return acc;
    }

    const lineNo = update.lineNo;
    const inRange = HandleParseUpdate.inRange(node, lineNo);

    if (inRange) {
      const updateIndex = this.updateIndex(acc, lineNo);

      acc[updateIndex].query.push({
        table: type,
        args: this.typeArgs(type, node)
      });

      const isTarget = HandleParseUpdate.isTarget(node.position, update);

      if (type === "comment") {
        delete acc[updateIndex].id;
        acc[updateIndex].update = comment({}, node);
      }

      if (isTarget) {
        const fields = keyFields[type];
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
          this.refIds.push(updatedFields.id);
        }

        acc[updateIndex].update = updatedFields;

        return acc;
      }

      this.recursive(node, acc, update);
    }

    return acc;
  }

  private mapper(nodes: any, update: any) {
    const node = nodes.find((node: any) =>
      node.originalName.includes(update.file)
    );

    const updates = update.lines
      .reduce(this.reducer.bind(this, null, node), [])
      .filter((line: any) => line.update);

    this.updateFilePaths.push(update.file);

    return { file: update.file, updates };
  }

  async run(): Promise<HandleParseUpdateReturn> {
    try {
      const nodes = await new Stream("children.*").run(this.filter, this.event);

      const updateResults = this.updates.map(this.mapper.bind(this, nodes));

      return {
        updateResults,
        updateRefIds: this.refIds,
        updateFilePaths: this.updateFilePaths
      };
    } catch (err) {
      throw err;
    }
  }
}
