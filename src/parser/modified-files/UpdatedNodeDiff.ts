import * as deepDiff from "deep-diff";

export class UpdatedNodeDiff {
  constructor(private stream: any, private modifiedFiles: any) {
    this.stream = stream;
    this.modifiedFiles = modifiedFiles;
  }

  private ignoreKeys = [
    "originalName",
    "id",
    "sources",
    "groups",
    "extendedBy"
  ];

  private diffFilter = (path: any, key: any) => {
    return (
      (path.length === 0 && key === "name") || this.ignoreKeys.includes(key)
    );
  };

  current = async () => {
    return this.stream.newFile(this.modifiedFiles);
  };

  compare = async (node: any) => {
    const modifiedFile = this.modifiedFiles.find((file: any) =>
      node.originalName.includes(file.path)
    );

    const content = await this.stream.oldFile(modifiedFile);

    const nodeDiffs = deepDiff.diff(content, node, this.diffFilter);

    if (nodeDiffs) {
      this.stream.modNode("data", nodeDiffs.length);
    }

    return { path: modifiedFile.path, diffs: nodeDiffs };
  };
}
