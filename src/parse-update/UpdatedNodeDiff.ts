import * as deepDiff from "deep-diff";

import { JsonStream } from "./JsonStream";

export class UpdatedNodeDiff {
  modifiedFiles: any;
  constructor(modifiedFiles: any) {
    this.modifiedFiles = modifiedFiles;
  }

  private ignoreKeys = [
    "originalName",
    "id",
    "sources",
    "groups",
    "extendedBy"
  ];

  private nodeFilter = (oid: string, row: any, _: any, cb: any) => {
    const filter = row.originalName.includes(oid);
    cb(null, filter && row);
  };

  private diffFilter = (path: any, key: any) => {
    return (
      (path.length === 0 && key === "name") || this.ignoreKeys.includes(key)
    );
  };

  map = async (node: any) => {
    const modifiedFile = this.modifiedFiles.find((file: any) =>
      node.originalName.includes(file.path)
    );

    const stream = new JsonStream(modifiedFile);
    const content = await stream.oldFile();

    const nodeDiffs = deepDiff.diff(content, node, this.diffFilter);

    return { path: modifiedFile.path, diffs: nodeDiffs };
  };
}
