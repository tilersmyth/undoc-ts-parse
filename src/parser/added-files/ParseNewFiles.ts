import { ParseNodeFields } from "../tools/ParseNodeFields";

export class ParseNewFiles extends ParseNodeFields {
  constructor() {
    super("new");
  }

  private filterDupeRefIds = (idArr: number[], id: number) => {
    return !idArr.includes(id);
  };

  files = (acc: any, file: any, index: number) => {
    const node = this.get(acc.parent, file);

    acc.files = [...acc.files, node.keys];

    // Filter out dupe refIds
    const nodeIds = node.refIds.filter(
      this.filterDupeRefIds.bind(null, acc.refIds)
    );

    acc.refIds = [...nodeIds, ...acc.refIds];

    return acc;
  };
}
