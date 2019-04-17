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

        const diffObj: any = { updates: [] };
        diffObj.path = file.path;

        const fileUpdates = file.diffs.map((diff: any) => {
          const nodeUpdates = new FormatNodeUpdates(diff, nodes);
          const formattedUpdates = diff.path.reduce(nodeUpdates.reduce, {
            query: [],
            update: null
          });
          const kind = this.updateKey[diff.kind];
          return { kind, ...formattedUpdates };
        });

        diffObj.updates.push(fileUpdates);

        return diffObj;
      });

      return modified;
    } catch (err) {
      throw err;
    }
  }
}
