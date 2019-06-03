import { NodeRefStream } from "./JsonStream";
import { ParseNewFiles } from "../added-files/ParseNewFiles";

export class ParseNodeRefs extends NodeRefStream {
  constructor(trackedFiles: string[]) {
    super(trackedFiles);
  }

  private oldRefIds: number[] = [];
  private referenceFiles: any = [];

  private filterRefs = (id: number) => !this.oldRefIds.includes(id);

  private recursive = async (
    newRefIds: number[]
  ): Promise<{ files: []; refs: {} }> => {
    if (newRefIds.length === 0) {
      return { files: [], refs: {} };
    }

    const refNodes = await this.search(newRefIds);

    const parseFiles = new ParseNewFiles();

    const { refIds, files } = refNodes.files.reduce(parseFiles.files, {
      files: [],
      refIds: [],
      parent: "files"
    });

    // Indicate reference IDs have been searched
    this.oldRefIds = [...newRefIds, ...this.oldRefIds];
    this.referenceFiles = [...files, ...this.referenceFiles];

    // Filter out reference IDs that have already been searched
    const refsToFind: number[] = refIds.filter(this.filterRefs);

    if (refsToFind.length > 0) {
      await this.recursive(refsToFind);
    }

    return { files: this.referenceFiles, refs: refNodes.refs };
  };

  find = async (newRefIds: number[]) => {
    const find = await this.recursive(newRefIds);

    // End stream here - after recursive search has finished
    this.addRef("stop");

    return find;
  };
}
