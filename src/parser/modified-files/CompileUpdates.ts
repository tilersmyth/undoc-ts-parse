import { FormatNodeUpdates } from "./FormatNodeUpdates";

export class CompileUpdates {
  private updateKey: any = {
    E: "modified",
    N: "added",
    D: "removed"
  };

  private formatQuery = (acc: any, diff: any) => {
    const updateKey = diff.path.pop();

    if (acc.length === 0) {
      acc.push({
        kind: diff.kind,
        path: diff.path,
        old: [{ key: updateKey, value: diff.lhs }]
      });
      return acc;
    }

    // Check if query path already exists
    const queryIndex: number = acc.findIndex(
      (query: any) => JSON.stringify(query.path) === JSON.stringify(diff.path)
    );

    if (queryIndex < 0) {
      acc.push({
        kind: diff.kind,
        path: diff.path,
        old: [{ key: updateKey, value: diff.lhs }]
      });

      return acc;
    }

    acc[queryIndex].old.push({ key: updateKey, value: diff.lhs });
    return acc;
  };

  reduce = (modifiedNodes: any, acc1: any, file: any) => {
    const nodes = modifiedNodes.find((node: any) =>
      node.originalName.includes(file.path)
    );

    // We do this to combine queries with the same path for purposes of
    // properly identifying the old node and mitigating what would be
    // redundant update queries
    const formatQueries = file.diffs.reduce(this.formatQuery, []);

    const node = formatQueries.reduce(
      (acc: any, diff: any) => {
        const nodeUpdates = new FormatNodeUpdates(diff, nodes);

        const formattedUpdates = diff.path.reduce(nodeUpdates.reduce, {
          query: [],
          entities: [],
          newNode: {}
        });

        const newNode = formattedUpdates.newNode;

        if (newNode.id && newNode.type && newNode.type === "reference") {
          acc.refIds = acc.refIds.includes(newNode.id)
            ? acc.refIds
            : [newNode.id, ...acc.refIds];
        }

        const updates = {
          kind: this.updateKey[diff.kind],
          query: formattedUpdates.query,
          newNode
        };

        acc.updates = [updates, ...acc.updates];

        return acc;
      },
      { updates: [], refIds: [] }
    );

    const fileUpdates = { path: file.path, updates: node.updates };

    acc1.updates = [fileUpdates, ...acc1.updates];
    acc1.refIds = [...node.refIds, ...acc1.refIds];

    return acc1;
  };
}
