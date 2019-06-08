import { Config, DiffPatcher } from "jsondiffpatch";

import { FormatDiff } from "./FormatDiff";

export class UpdatedNodeDiff {
  constructor(private stream: any, private files: any) {
    this.stream = stream;
    this.files = files;
  }

  private ignoreKeys: string[] = [
    "originalName",
    "id",
    "sources",
    "groups",
    "extendedBy"
  ];

  private hashKeys: string[] = ["kind", "name", "comment"];

  private objectHash = (obj: any) =>
    JSON.stringify(
      Object.keys(obj).reduce((acc: any, prop: any) => {
        return this.hashKeys.includes(prop) ||
          (prop === "type" && typeof obj[prop] === "string")
          ? [{ [prop]: obj[prop] }, ...acc]
          : acc;
      }, [])
    );

  private propertyFilter = (key: string, context: any) => {
    // Ignore file name as these are intentionally different
    // to distinguish old/new content
    if (key === "name" && context.left.kindString === "External module") {
      return false;
    }

    return !this.ignoreKeys.includes(key);
  };

  compare = async (accumulator: any, node: any) => {
    const acc = await accumulator;

    const compareFile = this.files.find((file: any) =>
      node.originalName.includes(file.path)
    );

    const content = await this.stream.oldFile(compareFile);

    const config: Config = {
      objectHash: this.objectHash,
      propertyFilter: this.propertyFilter
    };

    const jsondiffpatch = new DiffPatcher(config);
    const nodeDiffs = jsondiffpatch.diff(content, node);

    if (!nodeDiffs) {
      return acc;
    }

    const format = new FormatDiff(this.stream, nodeDiffs, content);
    const diff = format.queryBuilder(compareFile.path);

    acc.files = [diff.file, ...acc.files];
    acc.refIds = [...diff.refIds, ...acc.refIds];

    return acc;
  };
}
