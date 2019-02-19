export class UpdatedNodeUtils {
  static updateIndex(acc: any, lineNo: number): number {
    const lineIndex = acc.findIndex((line: any) => line.id === lineNo);

    if (lineIndex < 0) {
      const newLine = acc.push({ id: lineNo, query: [] });
      return newLine - 1;
    }

    return lineIndex;
  }

  static typeArgs(type: string, node: any) {
    // To do: abstract for all node types

    if (type === "type") {
      return {
        name: node.name,
        type: node.type
      };
    }

    return { name: node.name };
  }

  static inRange(node: any, lineNo: number): boolean {
    const position = node.position;
    if (!position) {
      return false;
    }

    return lineNo >= position.nodeStart && lineNo <= position.nodeEnd;
  }

  static isTarget(position: any, update: any) {
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
}
