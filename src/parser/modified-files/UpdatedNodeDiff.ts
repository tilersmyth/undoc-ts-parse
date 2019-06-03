import { Config, DiffPatcher } from "jsondiffpatch";

import { FormatDiff } from "./FormatDiff";

export class UpdatedNodeDiff {
  constructor(private stream: any, private files: any) {
    this.stream = stream;
    this.files = files;
  }

  private ignoreKeys = [
    "originalName",
    "id",
    "sources",
    "groups",
    "extendedBy"
  ];

  private objectHash = (obj: any) => {
    if (typeof obj.kind !== "undefined") {
      return obj.kind;
    }

    if (typeof obj.type === "string") {
      return obj.type;
    }

    if (typeof obj.name !== "undefined") {
      return obj.name;
    }

    return JSON.stringify(obj);
  };

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
