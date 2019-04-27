import { JsonStream } from "./JsonStream";
import { UpdatedNodeDiff } from "./UpdatedNodeDiff";
import { FormatNodeUpdates } from "./FormatNodeUpdates";

export class HandleParseUpdate {
  modifiedFiles: any;

  constructor(modifiedFiles: any) {
    this.modifiedFiles = modifiedFiles;
  }

  private updateKey: any = {
    E: "modified",
    N: "added",
    D: "removed"
  };

  async run(): Promise<[]> {
    try {
      const updatedNodes: any = await new JsonStream(
        this.modifiedFiles
      ).newFile();

      const nodeDiffs: any = new UpdatedNodeDiff(this.modifiedFiles);

      const files: any = await Promise.all(updatedNodes.map(nodeDiffs.map));

      const modified: any = files.map((file: any) => {
        const nodes = updatedNodes.find((node: any) =>
          node.originalName.includes(file.path)
        );

        // We do this to combine queries with the same path purposes of
        // properly identifying the old node (and it's more effecient)
        const formatQueries = file.diffs.reduce((acc: any, diff: any) => {
          const updateKey = diff.path.pop();

          //If query path ends with index number (as opposed to object key)
          // we will remove it as we have already nailed down are target identifiers here
          if (Number.isInteger(diff.path.slice(-1)[0])) {
            diff.path.pop();
          }

          if (acc.length === 0) {
            acc.push({
              kind: diff.kind,
              path: diff.path,
              old: [{ key: updateKey, value: diff.lhs }],
              new: [{ key: updateKey, value: diff.rhs }]
            });
            return acc;
          }

          // Check if query path already exists
          const queryIndex: number = acc.findIndex(
            (query: any) =>
              JSON.stringify(query.path) === JSON.stringify(diff.path)
          );

          if (queryIndex < 0) {
            acc.push({
              kind: diff.kind,
              path: diff.path,
              old: [{ key: updateKey, value: diff.lhs }],
              new: [{ key: updateKey, value: diff.rhs }]
            });

            return acc;
          }

          acc[queryIndex].old.push({ key: updateKey, value: diff.lhs });
          acc[queryIndex].new.push({ key: updateKey, value: diff.rhs });
          return acc;
        }, []);

        const fileUpdates = formatQueries.map((diff: any) => {
          const nodeUpdates = new FormatNodeUpdates(diff, nodes);

          const formattedUpdates = diff.path.reduce(nodeUpdates.reduce, {
            query: [],
            entities: []
          });

          const kind = this.updateKey[diff.kind];

          return {
            kind,
            query: formattedUpdates.query,
            newNode: diff.new
          };
        });

        return { path: file.path, updates: fileUpdates };
      });

      return modified;
    } catch (err) {
      throw err;
    }
  }
}
